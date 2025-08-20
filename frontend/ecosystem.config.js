module.exports = {
  apps: [{
    name: 'drinfinity-ai-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/opt/drinfinityai/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: '3000',
      NEXT_PUBLIC_API_BASE: 'https://ai.drinfinityai.com/api'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};