module.exports = {
  apps: [
    // Backend API (FastAPI with BioMistral)
    // Optimized for 8 CPU & 26GB RAM
    {
      name: 'drinfinity-ai-backend',
      script: '/opt/drinfinityai/backend/venv/bin/python3',
      args: '-m uvicorn api:app --host 0.0.0.0 --port 8000 --workers 4 --backlog 2048',
      cwd: '/opt/drinfinityai/backend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '20G',  // Increased for AI model
      min_uptime: '10s',
      max_restarts: 10,
      env: {
        PYTHONPATH: '/opt/drinfinityai/backend',
        HOST: '0.0.0.0',
        PORT: '8000',
        OMP_NUM_THREADS: '8',  // OpenMP threads for CPU optimization
        MKL_NUM_THREADS: '8',  // Intel MKL optimization
        OPENBLAS_NUM_THREADS: '8'  // OpenBLAS optimization
      },
      error_file: '/opt/drinfinityai/backend/logs/err.log',
      out_file: '/opt/drinfinityai/backend/logs/out.log',
      log_file: '/opt/drinfinityai/backend/logs/combined.log',
      time: true,
      merge_logs: true
    },
    
    // Frontend (Next.js)
    // Using cluster mode for load balancing
    {
      name: 'drinfinity-ai-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/opt/drinfinityai/frontend',
      instances: 2,  // 2 instances for better load handling
      exec_mode: 'cluster',  // Cluster mode for load balancing
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        NEXT_PUBLIC_API_BASE: 'https://ai.drinfinityai.com/api'
      },
      error_file: '/opt/drinfinityai/frontend/logs/err.log',
      out_file: '/opt/drinfinityai/frontend/logs/out.log',
      log_file: '/opt/drinfinityai/frontend/logs/combined.log',
      time: true,
      merge_logs: true
    }
  ]
};

