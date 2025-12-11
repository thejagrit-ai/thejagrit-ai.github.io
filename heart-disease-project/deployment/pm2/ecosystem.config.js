module.exports = {
  apps: [{
    name: 'heart-disease-backend',
    cwd: '/var/www/heart-disease/backend',
    script: 'run.py',
    interpreter: '/var/www/heart-disease/venv/bin/python',
    env: {
      FLASK_ENV: 'production',
      PYTHONUNBUFFERED: '1'
    },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/www/heart-disease/logs/backend-error.log',
    out_file: '/var/www/heart-disease/logs/backend-out.log',
    log_file: '/var/www/heart-disease/logs/backend-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};
