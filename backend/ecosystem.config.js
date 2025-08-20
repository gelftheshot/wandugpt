module.exports = {
  apps: [{
    name: 'drinfinity-ai-backend',
    script: 'python3',
    args: '-m uvicorn api:app --host 0.0.0.0 --port 8000',
    cwd: '/opt/drinfinityai/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '4G',
    env: {
      NODE_ENV: 'production',
      HOST: '0.0.0.0',
      PORT: '8000'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};