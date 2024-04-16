// файл ./config/index.js
const fs = require('fs');

const config = {
	db: {
    mysql : {
      host: 'localhost',
      user: 'user51', // замените на своего пользователя
      database: 'db51, // можете заменить 'appdb' на свое название базы данных
      password: 'AVNS_MqGbj8DcEDmUqAFYfE5, // замените это на пароль от своего пользователя
      port: 3000, // порт базы данных
			ssl: {
			  ca: fs.readFileSync('/lab3/ca-certificate-test.crt'), // Путь к файлу ca.crt
			}
    },
  }, 
  port: 3000 // порт на котором будет запущен сервер приложения
};

module.exports =  config;
