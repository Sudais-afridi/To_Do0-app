// Registration
// Handle registration form submission
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const gmail = document.getElementById('gmail').value;
    const password = document.getElementById('password').value;
    
    // Store user data in localStorage
    const user = {
        fullName,
        gmail,
        password
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    
    // Show success alert with SweetAlert
    Swal.fire({
        title: 'Success!',
        text: 'Your data is submitted successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'animated tada'
        }
    }).then(() => {
        // Redirect to login page
        window.location.href = 'home.html';
    });
});

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const gmail = document.getElementById('loginGmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser && storedUser.gmail === gmail && storedUser.password === password) {
        // Store login status
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to todo app
        window.location.href = 'To-Do.html';
    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid email or password',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Check if user is logged in when accessing todo.html
if (window.location.pathname.includes('todo.html')) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        window.location.href = 'home.html';
    }
}

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'home.html';
});

// To-Do
document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentTaskId = null;
    
    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            // Using destructuring to get task properties
            const { id, title, description, completed } = task;
            
            const taskItem = document.createElement('li');
            taskItem.className = `list-group-item task-item ${completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div>
                    <div class="task-title">${title}</div>
                    ${description ? `<div class="task-description">${description}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${id}">Delete</button>
                    <button class="btn btn-sm ${completed ? 'btn-success' : 'btn-outline-secondary'} toggle-btn" data-id="${id}">
                        ${completed ? 'Completed' : 'Complete'}
                    </button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
        
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', handleToggle);
        });
    }
    
    // Add new task
    addTaskBtn.addEventListener('click', function() {
        currentTaskId = null;
        document.getElementById('modalTitle').textContent = 'Add Task';
        document.getElementById('taskId').value = '';
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        taskModal.show();
    });
    
    // Save task (add or edit)
    saveTaskBtn.addEventListener('click', function() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        
        if (!title) {
            alert('Task title is required');
            return;
        }
        
        if (currentTaskId) {
            // Edit existing task
            tasks = tasks.map(task => 
                task.id === currentTaskId 
                    ? { ...task, title, description }
                    : task
            );
        } else {
            // Add new task
            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                completed: false
            };
            tasks.push(newTask);
        }
        
        saveTasks();
        taskModal.hide();
    });
    
    // Handle edit
    function handleEdit(e) {
        const taskId = e.target.getAttribute('data-id');
        currentTaskId = taskId;
        
        // Using destructuring to find the task
        const taskToEdit = tasks.find(({id}) => id === taskId);
        
        if (taskToEdit) {
            document.getElementById('modalTitle').textContent = 'Edit Task';
            document.getElementById('taskId').value = taskToEdit.id;
            document.getElementById('taskTitle').value = taskToEdit.title;
            document.getElementById('taskDescription').value = taskToEdit.description || '';
            taskModal.show();
        }
    }
    
    // Handle delete
    function handleDelete(e) {
        const taskId = e.target.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(({id}) => id !== taskId);
            saveTasks();
        }
    }
    
    // Handle toggle complete
    function handleToggle(e) {
        const taskId = e.target.getAttribute('data-id');
        
        tasks = tasks.map(task => 
            task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
        );
        
        saveTasks();
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
    
    // Initial render
    renderTasks();
});
