// Функция для загрузки задач с сервера
function loadTasks() {
	// Предполагаем, что сервер запущен на localhost:3000
	// Также предполагаем, что у вас метод получения всех задач называется getTasks и находится на данном пути
  fetch('http://localhost:3000/getTasks')
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        taskList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching tasks:', error));
}



// Функция для добавления задачи на сервер
function addTask(taskName) {
  fetch('http://localhost:3000/addTask', {
    method: 'POST', headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({name: taskName})
  })
    .then(response => response.text())
    .then(message => {
      console.log(message);
      loadTasks(); // После добавления задачи перезагружаем список задач
    })
    .catch(error => console.error('Error adding task:', error));
}

// Обработчик события отправки формы
document.getElementById('taskForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы
  const taskInput = document.getElementById('taskInput');
  const taskName = taskInput.value.trim();
  if (taskName !== '') {
    addTask(taskName); // Вызываем функцию добавления задачи
    taskInput.value = ''; // Очищаем поле ввода
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Обработка формы входа
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      localStorage.setItem('token', data.token); // Сохранение токена в localStorage
      alert('Вы успешно вошли');
    } catch (error) {
      console.error('Ошибка при входе:', error);
      alert('Ошибка при входе');
    }
  });

// Обработка авторизации
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  loginForm.addEventListener('submit', handleLoginFormSubmit);

  async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      alert('Вы успешно вошли');
    } catch (error) {
      console.error('Ошибка при входе:', error);
      alert('Ошибка при входе');
    }
  }

  async function loginUser(username, password) {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при выполнении запроса');
    }

    return await response.json();
  }
});
// конец обработки авторизации
  // Обработка формы регистрации
  document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });
      alert('Пользователь успешно зарегистрирован');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Ошибка при регистрации');
    }
  });
});

// После загрузки страницы сразу загружаем задачи
loadTasks();
