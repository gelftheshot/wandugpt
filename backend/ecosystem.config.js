module.exports = {
  apps: [{
    name: 'drinfinity-ai-backend',
    script: '/opt/drinfinityai/backend/venv/bin/python3',
    args: '-m uvicorn api:app --host 0.0.0.0 --port 8000 --workers 2',
    cwd: '/opt/drinfinityai/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '6G',
    env: {
      PYTHONPATH: '/opt/drinfinityai/backend',
      HOST: '0.0.0.0',
      PORT: '8000'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true
  }]
};