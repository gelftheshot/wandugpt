# Performance Optimization Summary
## Server Specs: 8 CPU Cores | 26GB RAM

---

## 🚀 **Optimizations Applied**

### **Backend (FastAPI + BioMistral)**

#### Model Configuration
- ✅ **Context Window**: 8K tokens (8192) - ~4GB RAM usage
- ✅ **CPU Threads**: 8 (using all cores)
- ✅ **Batch Threads**: 8 (parallel batch processing)
- ✅ **Batch Size**: 2048 (high throughput)
- ✅ **Max Tokens**: 1024 (longer AI responses)
- ✅ **Memory Lock**: Enabled (keeps model in RAM)
- ✅ **Memory Map**: Enabled (fast file access)
- ✅ **OpenMP Threads**: 8 (CPU optimization)

#### Uvicorn Configuration
- ✅ **Workers**: 4 (handles multiple requests)
- ✅ **Backlog**: 2048 (connection queue)
- ✅ **Keep-Alive**: 60s (persistent connections)
- ✅ **Access Logging**: Enabled

#### PM2 Configuration
- ✅ **Max Memory**: 20GB (ample for AI model)
- ✅ **Auto-restart**: Enabled
- ✅ **Environment Variables**: OMP, MKL, OpenBLAS optimized

---

### **Frontend (Next.js)**

#### PM2 Configuration
- ✅ **Instances**: 2 (cluster mode)
- ✅ **Exec Mode**: Cluster (load balancing)
- ✅ **Max Memory**: 2GB per instance
- ✅ **Auto-restart**: Enabled

---

## 📊 **Expected Resource Usage**

### **Backend**
| Resource | Usage | Notes |
|----------|-------|-------|
| RAM | 15-18GB | Model (5GB) + Context (4GB) + Overhead |
| CPU | 60-80% | During active inference |
| Workers | 4 | Concurrent request handling |

### **Frontend**
| Resource | Usage | Notes |
|----------|-------|-------|
| RAM | 2-4GB | 2 instances × 2GB max |
| CPU | 10-20% | Serving static/SSR pages |
| Instances | 2 | Load balanced |

### **Total Usage**
| Resource | Usage | Available | Status |
|----------|-------|-----------|--------|
| **RAM** | ~20GB | 26GB | ✅ Safe margin |
| **CPU** | 70-90% | 8 cores | ✅ Well utilized |

---

## 🎯 **Performance Benefits**

### **Response Speed**
- ⚡ **Faster Generation**: 8 threads = faster token generation
- ⚡ **Better Throughput**: Large batch size = efficient processing
- ⚡ **Lower Latency**: Memory lock = no disk I/O during inference
- ⚡ **Quick Startup**: Memory map = fast model loading

### **Concurrent Users**
- 👥 **Backend**: 4 workers can handle 4 simultaneous AI requests
- 👥 **Frontend**: 2 instances can serve many page requests
- 👥 **Total Capacity**: ~10-15 concurrent users smoothly

### **Reliability**
- 🔄 **Auto-restart**: If crash, PM2 restarts automatically
- 🔄 **Memory Management**: Restarts if exceeds 20GB
- 🔄 **Load Balancing**: Frontend spreads across 2 instances

---

## 📈 **Benchmarking (Estimated)**

### **Token Generation Speed**
- **Tokens/sec**: ~15-25 tokens/sec (CPU-based)
- **Response Time**: 500-700ms for typical medical query
- **Full Response**: 30-50 seconds for 1000-token answer

### **Context Understanding**
- **Context Window**: 8K tokens (~6000 words)
- **Conversation Memory**: Last 3 exchanges (~6 messages)
- **Sufficient For**: Most medical consultations

---

## 🛠️ **Fine-Tuning Options**

### **If Users Experience Slowness:**

#### Option 1: Reduce Workers (More RAM per worker)
```javascript
// ecosystem.config.js - Backend
args: '-m uvicorn api:app --host 0.0.0.0 --port 8000 --workers 2'
```

#### Option 2: Reduce Batch Size (Faster response start)
```python
# api.py - MODEL_CONFIG
"n_batch": 1024,  # Smaller batch = faster first token
```

#### Option 3: Reduce Context (More memory for model)
```python
# api.py - MODEL_CONFIG
"n_ctx": 4096,  # Smaller context = faster processing
```

---

### **If You Want Even Better Performance:**

#### Option 1: Increase Workers (More concurrent users)
```javascript
// ecosystem.config.js - Backend
args: '-m uvicorn api:app --host 0.0.0.0 --port 8000 --workers 6'
```

#### Option 2: Add Redis Cache (Cache common queries)
```bash
sudo apt install redis-server
pip install redis
```

#### Option 3: Use Smaller Model (Faster but less accurate)
- Download Q3_K_M quantization (~3.5GB)
- Change MODEL_PATH in api.py

---

## 🔍 **Monitoring**

### **Check Performance**

```bash
# System resources
htop                              # CPU & RAM usage
pm2 monit                         # PM2 resource monitor

# Service metrics
pm2 status                        # Check if running smoothly
pm2 logs drinfinity-ai-backend    # Check for errors

# Backend health
curl http://localhost:8000/health

# Test response time
time curl -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "What is diabetes?", "session_id": "test123"}'
```

### **Performance Metrics to Watch**

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| RAM Usage | <20GB | 20-24GB | >24GB |
| CPU Usage | 60-80% | 80-95% | >95% |
| Response Time | <1s | 1-3s | >3s |
| PM2 Restarts | 0/day | 1-2/day | >3/day |

---

## 💡 **Best Practices**

1. **Monitor Regularly**: Check `pm2 status` daily
2. **Watch Logs**: `pm2 logs --lines 100` to catch issues
3. **Memory Management**: Restart weekly if needed: `pm2 restart all`
4. **Load Testing**: Test with 5-10 concurrent users before launch
5. **Backup Config**: Keep copy of working ecosystem.config.js

---

## 🚨 **Troubleshooting**

### **Backend Uses Too Much RAM**
```bash
# Reduce context window to 4096
vim /opt/drinfinityai/backend/api.py
# Change: "n_ctx": 4096
pm2 restart drinfinity-ai-backend
```

### **Slow Response Times**
```bash
# Check CPU usage
htop
# If CPU at 100%, consider reducing concurrent users or batch size
```

### **Out of Memory**
```bash
# Check memory
free -h
# Restart backend
pm2 restart drinfinity-ai-backend
# If persists, reduce n_ctx to 4096
```

---

## 🎯 **Current Configuration Summary**

```yaml
Backend:
  Model: BioMistral-7B (Q4_K_M)
  Context: 8K tokens
  CPU Threads: 8
  Workers: 4
  Max RAM: 20GB
  Expected RAM: 15-18GB

Frontend:
  Instances: 2
  Mode: Cluster
  Max RAM: 2GB per instance
  Expected RAM: 2-4GB total

Total System:
  CPU Utilization: 70-90%
  RAM Utilization: 75-85%
  Reserved: ~6GB for OS
```

---

## ✅ **Deployment Checklist**

- [ ] Updated api.py with optimized MODEL_CONFIG
- [ ] Updated ecosystem.config.js with resource limits
- [ ] Tested on local machine first
- [ ] Pushed changes to server
- [ ] Restarted PM2: `pm2 restart all`
- [ ] Checked logs: `pm2 logs --lines 50`
- [ ] Tested response time with real query
- [ ] Monitored resource usage: `pm2 monit`
- [ ] Verified health endpoint: `curl localhost:8000/health`

---

**Optimization Complete! Your server is now configured for smooth AI chat with maximum performance! 🚀**

