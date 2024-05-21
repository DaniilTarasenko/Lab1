// файл ./app.js
const express = require('express');
const { Pool } = require('pg');
const config = require('/config/index.js');
const cors = require('cors');
const app = express();
const port = config.port;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

app.use(express.json());
app.use(cors());

// Конфигурация подключения к базе данных
const pool = new Pool(config.db.postgresql);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Пример маршрута Express
app.get('/getTasks', (req, res) => {
  // Пример запроса к базе данных
  pool.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Результаты запроса:', results.rows);
    res.json(results.rows);
  });
});

// Подключение к базе данных
pool.connect((err, client, release) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }
  console.log('Подключение к базе данных успешно установлено');
});

// Пример маршрута Express для добавления записи в таблицу tasks с указанным именем
app.post('/addTask', (req, res) => {
  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskName = req.body.name;

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

app.get('/createTasksTable', (req, res) => {
  const createTableSql = 'CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)';
  dbConnection.query(createTableSql, (err, result) => {
    if (err){
      console.error('Ошибка при создании таблицы'+ err.stack);
      res.status(500).send('Ошибка сервера при создании таблицы');
      return;
    }
    console.log('Таблица tasks успешно создана или уже существует');
    res.send('Таблица tasks успешно создана или уже существует');
  });
});
app.post()

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    // Сохранение пользователя в базе данных
    dbConnection.query(
      `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`,
      (err, result) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }
        console.log('Пользователь успешно зарегистрирован');
        res.status(201).send('Пользователь успешно зарегистрирован');
      }
    );
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Вход пользователя
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Поиск пользователя в базе данных
    dbConnection.query(
      `SELECT * FROM users WHERE username = '${username}'`,
      async (err, results) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }
        if (results.length === 0) {
          res.status(401).send('Неверные учетные данные');
          return;
        }
        const user = results[0];
        // Проверка пароля
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          res.status(401).send('Неверные учетные данные');
          return;
        }
        // Генерация JWT токена
        const token = jwt.sign({ username: user.username }, config.jwtSecret);
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error('Ошибка при входе пользователя:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Проверка аутентификации с использованием JWT
app.get('/profile', (req, res) => {
  // Получение токена из заголовка Authorization
  const token = req.headers.authorization.split(' ')[1];
  try {
    // Проверка токена
    const decoded = jwt.verify(token, config.jwtSecret);
    res.status(200).json({ username: decoded.username });
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    res.status(401).send('Неверный токен');
  }
});


  // SQL-запрос для добавления записи с указанным именем в таблицу tasks
  const sqlQuery = `INSERT INTO tasks (name) VALUES ('${taskName}')`;

  // Выполнение SQL-запроса к базе данных
  dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Запись успешно добавлена в таблицу tasks');
    res.send('Запись успешно добавлена в таблицу tasks');
  });
});

// Создание транспортера для отправки email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Ваш email
    pass: 'your_password' // Пароль от вашего email
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохранение пользователя в базе данных
    dbConnection.query(
      `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
      [username, hashedPassword, email],
      async (err, result) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }

        const userId = result.insertId; // Получаем идентификатор созданного пользователя

        // Генерация токена подтверждения почты, который живет 1 день
        const emailConfirmToken = jwt.sign({ userId, email }, config.jwtSecret, { expiresIn: '1d' });

        // Сохранение кода подтверждения в таблице email_confirmation
        dbConnection.query(
          `INSERT INTO email_confirmation (userId, emailConfirmToken) VALUES (?, ?)`,
          [userId, emailConfirmToken],
          (err, result) => {
            if (err) {
              console.error('Ошибка сохранения кода подтверждения: ' + err.stack);
              res.status(500).send('Ошибка сервера');
              return;
            }

            console.log('Код подтверждения успешно создан');

            // Отправка письма с подтверждением почты
            const mailOptions = {
              from: 'your_email@gmail.com',
              to: email,
              subject: 'Подтверждение регистрации',
              html: `<p>Для подтверждения регистрации перейдите по ссылке: <a href="http://localhost:3000/confirm/${emailConfirmToken}">Подтвердить регистрацию</a></p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Ошибка при отправке письма:', error);
                res.status(500).send('Ошибка сервера');
              } else {
                console.log('Письмо с подтверждением отправлено:', info.response);
                res.status(201).send('Пользователь успешно зарегистрирован. Проверьте вашу почту для подтверждения регистрации.');
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).send('Ошибка сервера');
  }
});


const User = require('./models/User');

app.get('/confirm/:token', async (req, res) => {
  try {
    const token = req.params.token;

    // Раскодирование токена
    const decoded = jwt.verify(token, config.jwtSecret);
    const { userId, email } = decoded;

    // Поиск пользователя по userId
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send('Пользователь не найден');
      return;
    }

    if (user.emailConfirmToken !== token) {
      res.status(404).send('Неверный код подтверждения');
      return;
    }

    // Обновление пользователя как подтвержденного
    user.isConfirmed = true;
    user.emailConfirmToken = null;
    await user.save();

    console.log('Регистрация успешно подтверждена');

    res.status(200).send('Регистрация успешно подтверждена');
  } catch (error) {
    console.error('Ошибка при подтверждении регистрации:', error);
    res.status(500).send('Ошибка сервера');
  }
});


app.post('/folders', async (req, res) => {
  try {
    const { folderName } = req.body;

    // Сохранение новой папки в базе данных
    dbConnection.query(
      `INSERT INTO folders (folderName) VALUES (?)`,
      [folderName],
      (err, result) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }

        const folderId = result.insertId; // Получаем идентификатор созданной папки

        res.status(201).json({ folderId, folderName });
      }
    );
  } catch (error) {
    console.error('Ошибка при создании папки:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Эндпоинт редактирования названия папки
app.put('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;
  const { folderName } = req.body;

  // Обновление названия папки в базе данных
  dbConnection.query(
    `UPDATE folders SET folderName = ? WHERE folderId = ?`,
    [folderName, folderId],
    (err, result) => {
      if (err) {
        console.error('Ошибка выполнения запроса: ' + err.stack);
        res.status(500).send('Ошибка сервера');
        return;
      }

      res.status(200).send('Название папки успешно обновлено');
    }
  );
});

// Эндпоинт для удаления папки вместе с задачами
app.delete('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;

  // Удаление всех задач, принадлежащих данной папке
  dbConnection.query(
    `DELETE FROM tasks WHERE folderId = ?`,
    [folderId],
    (err, result) => {
      if (err) {
        console.error('Ошибка выполнения запроса: ' + err.stack);
        res.status(500).send('Ошибка сервера');
        return;
      }

      // Удаление самой папки из базы данных
      dbConnection.query(
        `DELETE FROM folders WHERE folderId = ?`,
        [folderId],
        (err, result) => {
          if (err) {
            console.error('Ошибка выполнения запроса: ' + err.stack);
            res.status(500).send('Ошибка сервера');
            return;
          }

          res.status(200).send('Папка успешно удалена вместе с задачами');
        }
      );
    }
  );
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
