document.addEventListener('DOMContentLoaded', () => {

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const errorMsg = document.getElementById('error-msg');
    const todoList = document.getElementById('todo-list');
    const filterBtn = document.getElementById('filter-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const noTaskMsg = document.getElementById('no-task-msg');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        const todoList = document.getElementById('todo-list');

        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'pending') {
                return todo.status === 'pending';
            } else if (currentFilter === 'completed') {
                return todo.status === 'completed';
            }
            return true;
        });

        if (filteredTodos.length === 0) {
            noTaskMsg.style.display = 'block';
        } else {
            noTaskMsg.style.display = 'none';
        }

        filteredTodos.forEach((todo) => {
            const originalIndex = todos.indexOf(todo);

            const li = document.createElement('li');
            li.className = `todo-item ${todo.status === 'completed' ? 'completed' : ''}`;
            li.dataset.index = originalIndex;

            li.innerHTML = `
                <div class="todo-item__details">
                    <span class="todo-item__text">${todo.text}</span>
                    <span class="todo-item__date">
                        Due date: ${todo.date || 'None'} | Status: ${todo.status}
                    </span>
                </div>
                <div class="todo-item__actions">
                    <button class="btn btn-complete">
                        ${todo.status === 'pending' ? 'Selesai' : 'Batal'}
                    </button>
                    <button class="btn btn-delete">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    function handleAddTask(event) {
        event.preventDefault();

        const text = todoInput.value.trim();
        const date = todoDate.value;

        if (text === '' || date === '') {
            errorMsg.textContent = "Please fill in both fields.";
            errorMsg.style.display = 'block';
            if (text === '') todoInput.classList.add('error');
            if (date === '') todoDate.classList.add('error');
            return;
        }

        errorMsg.style.display = 'none';
        todoInput.classList.remove('error');
        todoDate.classList.remove('error');

        todos.push({
            text: text,
            date: date,
            status: 'pending'
        });

        saveTodos();

        todoForm.reset();

        renderTodos();
    }

    function handleDeleteAll() {
        if (confirm('Are you sure that you want to delete ALL task?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    }

    function handleFilter() {
        if (currentFilter === 'all') {
            currentFilter = 'pending';
            filterBtn.textContent = 'Filter: Pending';
        } else if (currentFilter === 'pending') {
            currentFilter = 'completed';
            filterBtn.textContent = 'Filter: Completed';
        } else {
            currentFilter = 'all';
            filterBtn.textContent = 'Filter: All';
        }
        renderTodos();
    }

    function handleListClick(event) {
        const target = event.target;

        const todoItem = target.closest('li.todo-item');
        if (!todoItem) return;

        const index = parseInt(todoItem.dataset.index, 10);

        if (target.classList.contains('btn-complete')) {
            todos[index].status = todos[index].status === 'pending' ? 'completed' : 'pending';
        }

        if (target.classList.contains('btn-delete')) {
            todos.splice(index, 1);
        }

        saveTodos();
        renderTodos();
    }

    todoForm.addEventListener('submit', handleAddTask);

    deleteAllBtn.addEventListener('click', handleDeleteAll);

    filterBtn.addEventListener('click', handleFilter);

    todoList.addEventListener('click', handleListClick);

    renderTodos();
});