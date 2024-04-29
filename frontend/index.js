<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <style>
        /* Стили для простоты, можно изменить по вашему желанию */
        body {
            font-family: Arial, sans-serif;
        }
        #taskList {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
<h1>To-Do List</h1>
<form id="taskForm">
    <input type="text" id="taskInput" placeholder="Add a new task">
    <button type="submit">Add Task</button>
</form>
<ul id="taskList">
    <!-- Сюда будут добавляться задачи -->
</ul>

<script src="script.js"></script> <!-- Подключаем JavaScript файл -->
</body>
</html>
