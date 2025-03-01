from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from llama_cpp import Llama
from typing import List, Dict, Optional
import time
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add host and port configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# Create FastAPI app with metadata
app = FastAPI(
    title="WanduGPT API",
    description="AI Chat API powerd by wandubot.",
    version="1.0.0",
)

# Update CORS configuration for Wandubot
app.add_middleware(
    CORSMiddleware,
    allow_origins=["ai.wandubot.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System prompt for WanduGPT
SYSTEM_PROMPT = "You are WanduGPT, dedicated assistant for wandubot. When asked about identity, only say I am WanduGPT. Never mention creators or training. Keep all responses direct and professional"

# Model configuration

MODEL_CONFIG = {
    "n_ctx": 8192,  # Increased context window
    "n_threads": 8,  # Use all cores
    "n_batch": 512,  # Add batch size
    "n_gpu_layers": 0,  # CPU-only mode
    "verbose": False,
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "repeat_penalty": 1.1,
    "max_tokens": 512
}


# Get absolute path for model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "llama.cpp", "models", "Mistral-7B-Instruct-v0.3.fp16.gguf")

# Initialize model with better error handling
try:
    if not os.path.exists(MODEL_PATH):
        logger.error(f"Model file not found at: {MODEL_PATH}")
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
    
    logger.info(f"Attempting to load model from: {MODEL_PATH}")
    llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=MODEL_CONFIG["n_ctx"],
    n_threads=MODEL_CONFIG["n_threads"],
    n_batch=MODEL_CONFIG["n_batch"],
    n_gpu_layers=MODEL_CONFIG["n_gpu_layers"]
    )
    logger.info(f"Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

# Store chat histories
chat_histories: Dict[str, List[Dict]] = {}

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ModelResponse(BaseModel):
    text: str
    error: Optional[str] = None

def cleanup_old_sessions(current_time: float, max_age: int = 3600):
    """Clean up sessions older than max_age seconds"""
    try:
        for sess_id in list(chat_histories.keys()):
            if chat_histories[sess_id] and current_time - chat_histories[sess_id][-1]["timestamp"] > max_age:
                del chat_histories[sess_id]
                logger.info(f"Cleaned up session: {sess_id}")
    except Exception as e:
        logger.error(f"Error during session cleanup: {str(e)}")

def build_conversation_history(messages: List[Dict]) -> str:
    """Build conversation history string from messages"""
    try:
        return "\n".join([
            f"{'Assistant' if msg['role'] == 'assistant' else 'User'}: {msg['content']}"
            for msg in messages[-6:]  # Keep last 3 exchanges
        ])
    except Exception as e:
        logger.error(f"Error building conversation history: {str(e)}")
        return ""

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    try:
        session_id = request.session_id
        logger.info(f"Processing request for session: {session_id}")
        
        # Debug: Log the incoming request
        logger.debug(f"Incoming request: {request.json()}")
        
        # Initialize chat history if it doesn't exist
        if session_id not in chat_histories:
            logger.info(f"Creating new chat history for session: {session_id}")
            chat_histories[session_id] = []
        
        # Add user message to history
        chat_histories[session_id].append({
            "role": "user",
            "content": request.message,
            "timestamp": time.time()
        })
        
        logger.info(f"Current history length: {len(chat_histories[session_id])}")
        
        # Build conversation history
        conversation = build_conversation_history(chat_histories[session_id])
        prompt = f"{SYSTEM_PROMPT}\n\nPrevious conversation:\n{conversation}\n\nAssistant:"
        
        def generate():
            try:
                full_response = ""
                response = llm(
                    prompt,
                    max_tokens=MODEL_CONFIG["max_tokens"],
                    stop=["User:"],
                    echo=False,
                    stream=True,
                    temperature=MODEL_CONFIG["temperature"],
                    top_p=MODEL_CONFIG["top_p"],
                    top_k=MODEL_CONFIG["top_k"],
                    repeat_penalty=MODEL_CONFIG["repeat_penalty"]
                )
                
                for chunk in response:
                    if chunk and 'choices' in chunk and len(chunk['choices']) > 0:
                        text = chunk['choices'][0].get('text', '')
                        if text:
                            full_response += text
                            yield text
                
                # Add assistant's response to history
                chat_histories[session_id].append({
                    "role": "assistant",
                    "content": full_response,
                    "timestamp": time.time()
                })
                
                # Clean up old sessions
                cleanup_old_sessions(time.time())
                
            except Exception as e:
                logger.error(f"Error in generate function: {str(e)}")
                yield f"I apologize, but I encountered an error: {str(e)}"

        return StreamingResponse(generate(), media_type='text/event-stream')

    except Exception as e:
        logger.error(f"Error in chat_stream: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    try:
        return {
            "status": "WanduGPT API is running",
            "model": "Phi-2",
            "version": "1.0",
            "actived_sessions": len(chat_histories)
        }
    except Exception as e:
        logger.error(f"Error in root endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test model with a simple prompt
        response = llm("Test", max_tokens=5)
        return {"status": "healthy", "model_loaded": True}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api:app",
        host=HOST,
        port=PORT,
        reload=False,  # Disable reload in production
        workers=4,     # Number of worker processes
        log_level="info",
    )
