module.exports = {
  apps: [
    {
      name: 'aixbiz-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    },
    {
      name: 'aixbiz-backend',
      script: './dist/server.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 4004
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '300M',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    }
  ]
};