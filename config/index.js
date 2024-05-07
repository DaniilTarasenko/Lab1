// файл ./backend/config/index.js
const fs = require('fs');
const config = {
  db: {
    postgresql: {
      host: 'localhost',
      user: 'man',
      database: 'postgres',
      password: 'qwerty',
      port: 5432, // порт базы данных PostgreSQL по умолчанию
    },
  },
  port: 3000, // порт на котором будет запущен сервер приложения
  jwtSecret: "mysecretkey"
};

module.exports = config;
