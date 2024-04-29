// файл ./backend/config/index.js
const config = {
	db : {
    mysql : {
      host     : 'localhost',
      user     : 'user', // замените на своего пользователя
      database : 'appdb', // можете заменить 'appdb' на свое название базы данных
      password : 'yourPasswordHere' // замените это на пароль от своего пользователя
      port: 25060, // порт базы данных
			ssl: {
			  ca: fs.readFileSync('path/ca-certificate-test.crt'), // Путь к файлу ca.crt
			}
    },
  }, 
  port : 3000 // порт на котором будет запущен сервер приложения
  jwtSecret: 'mysecretkey' // Секретный ключ для подписи и верификации JWT токенов, вы его либо сами генерируете, либо сами придумываете
};

module.exports =  config;
