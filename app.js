/ файл ./app.js
const express = require('express');
const mysql = require('mysql');
const config = require('/lab3/index.js');

const app = express();
const port = config.port;

app.use(express.json());

// Конфигурация подключения к базе данных
const dbConnection = mysql.createConnection(config.db.mysql);

// Подключение к базе данных
dbConnection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }
  console.log('Подключение к базе данных успешно установлено');
});

// Пример маршрута Express
app.get('/getTasks', (req, res) => {
  // Пример запроса к базе данных
  dbConnection.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Результаты запроса:', results);
    res.json(results);
  });
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
});

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

// Нахождение задачи по id
app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id; // Получаем id задачи из URL
  const findTaskSql = 'SELECT * FROM tasks WHERE id = ?'; // SQL запрос для поиска задачи по id
  dbConnection.query(findTaskSql, [taskId], (err, result) => {
    if (err){
      console.error('Ошибка при выполнении запроса:'+ err.stack);
      res.status(500).send('Ошибка сервера при выполнении запроса');
      return;
    }
    if (result.length > 0) {
      res.send(result[0]); // Отправляем найденную задачу в качестве ответа
    } else {
      res.status(404).send('Задача с указанным id не найдена');
    }
  });
});

// Редактирование задачи по id
app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id; // Получаем id задачи из URL
  const { name, description, folderId } = req.body; // Получаем новые данные для задачи из тела запроса
  const updateTaskSql = 'UPDATE tasks SET name = ?, description = ?, folderId = ? WHERE id = ?'; // SQL запрос для редактирования задачи
  dbConnection.query(updateTaskSql, [name, description, folderId, taskId], (err, result) => {
    if (err){
      console.error('Ошибка при выполнении запроса:'+ err.stack);
      res.status(500).send('Ошибка сервера при выполнении запроса');
      return;
    }
    if (result.affectedRows > 0) {
      res.send('Задача успешно отредактирована');
    } else {
      res.status(404).send('Задача с указанным id не найдена');
    }
  });
});

// Удаление задачи по id
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id; // Получаем id задачи из URL
  const deleteTaskSql = 'DELETE FROM tasks WHERE id = ?'; // SQL запрос для удаления задачи
  dbConnection.query(deleteTaskSql, [taskId], (err, result) => {
    if (err){
      console.error('Ошибка при выполнении запроса:'+ err.stack);
      res.status(500).send('Ошибка сервера при выполнении запроса');
      return;
    }
    if (result.affectedRows > 0) {
      res.send(`Задача с id ${taskId} успешно удалена`);
    } else {
      res.status(404).send('Задача с указанным id не найдена');
    }
  });
});


// файл ./backend/app.js

// Регистрация пользователя
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

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
