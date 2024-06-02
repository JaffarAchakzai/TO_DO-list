document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const prioritySelect = document.getElementById('priority-level');
    const taskList = document.getElementById('task-list');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        if (taskText !== '') {
            const listItem = document.createElement('li');

            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            taskTextSpan.textContent = taskText;

            const prioritySpan = document.createElement('span');
            prioritySpan.className = 'priority';
            prioritySpan.textContent = priority;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'actions';

            buttonContainer.appendChild(createCompleteButton(listItem));
            buttonContainer.appendChild(createEditButton(listItem));
            buttonContainer.appendChild(createDeleteButton(listItem));

            listItem.appendChild(taskTextSpan);
            listItem.appendChild(prioritySpan);
            listItem.appendChild(buttonContainer);
            listItem.dataset.priority = priority;

            taskList.appendChild(listItem);
            sortTasks();
            saveTasks();
            taskInput.value = '';
        }
    }

    function createCompleteButton(listItem) {
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.className = 'complete-button';
        completeButton.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveTasks();
        });
        return completeButton;
    }

    function createEditButton(listItem) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {
            if (listItem.classList.contains('editing')) {
                listItem.classList.remove('editing');
                listItem.contentEditable = false;
                editButton.textContent = 'Edit';
                saveTasks();
            } else {
                listItem.classList.add('editing');
                listItem.contentEditable = true;
                listItem.focus();
                editButton.textContent = 'Save';
            }
        });
        return editButton;
    }

    function createDeleteButton(listItem) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
            saveTasks();
        });
        return deleteButton;
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent.trim(),
                priority: item.dataset.priority,
                completed: item.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');

            const taskTextSpan = document.createElement('span');
            taskTextSpan.className = 'task-text';
            taskTextSpan.textContent = task.text;

            const prioritySpan = document.createElement('span');
            prioritySpan.className = 'priority';
            prioritySpan.textContent = task.priority;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'actions';

            buttonContainer.appendChild(createCompleteButton(listItem));
            buttonContainer.appendChild(createEditButton(listItem));
            buttonContainer.appendChild(createDeleteButton(listItem));

            listItem.appendChild(taskTextSpan);
            listItem.appendChild(prioritySpan);
            listItem.appendChild(buttonContainer);
            listItem.dataset.priority = task.priority;

            if (task.completed) {
                listItem.classList.add('completed');
            }

            taskList.appendChild(listItem);
        });
        sortTasks();
    }

    function sortTasks() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const priorities = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return priorities[b.dataset.priority] - priorities[a.dataset.priority];
        });
        tasks.forEach(task => taskList.appendChild(task));
    }
});
