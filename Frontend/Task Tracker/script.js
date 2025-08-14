// Task Tracker Application
class TaskTracker {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        
        // DOM elements
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.tasksList = document.getElementById('tasksList');
        this.pendingCount = document.getElementById('pendingCount');
        this.completedCount = document.getElementById('completedCount');
        
        // Initialize the app
        this.init();
    }
    
    init() {
        // Add event listeners
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        
        // Load tasks from localStorage if available
        this.loadTasks();
        
        // Render initial tasks
        this.renderTasks();
    }
    
    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            return;
        }
        
        // Create new task object
        const newTask = {
            id: this.taskIdCounter++,
            description: taskText,
            completed: false,
            createdAt: new Date()
        };
        
        // Add to tasks array
        this.tasks.push(newTask);
        
        // Clear input
        this.taskInput.value = '';
        
        // Save to localStorage and re-render
        this.saveTasks();
        this.renderTasks();
        
        // Focus back to input
        this.taskInput.focus();
    }
    
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }
    
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }
    
    renderTasks() {
        // Clear the current list
        this.tasksList.innerHTML = '';
        
        // Separate pending and completed tasks
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);
        
        // Sort tasks by creation date (newest first for pending, oldest first for completed)
        pendingTasks.sort((a, b) => b.createdAt - a.createdAt);
        completedTasks.sort((a, b) => a.createdAt - b.createdAt);
        
        // Render pending tasks first
        pendingTasks.forEach(task => {
            this.renderTaskItem(task);
        });
        
        // Render completed tasks at the end
        completedTasks.forEach(task => {
            this.renderTaskItem(task);
        });
        
        // Update stats
        this.updateStats();
    }
    
    renderTaskItem(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
            >
            <span class="task-text">${this.escapeHtml(task.description)}</span>
            <button class="delete-btn" title="Delete task">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        
        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        
        this.tasksList.appendChild(li);
    }
    
    updateStats() {
        const pendingCount = this.tasks.filter(task => !task.completed).length;
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        this.pendingCount.textContent = `${pendingCount} pending`;
        this.completedCount.textContent = `${completedCount} completed`;
    }
    
    saveTasks() {
        localStorage.setItem('taskTracker_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskTracker_counter', this.taskIdCounter.toString());
    }
    
    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('taskTracker_tasks');
            const savedCounter = localStorage.getItem('taskTracker_counter');
            
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
                // Convert string dates back to Date objects
                this.tasks.forEach(task => {
                    task.createdAt = new Date(task.createdAt);
                });
            }
            
            if (savedCounter) {
                this.taskIdCounter = parseInt(savedCounter);
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.tasks = [];
            this.taskIdCounter = 1;
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskTracker();
});
