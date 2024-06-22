console.log("Task Details Script connected");

const baseURL = "https://task-management-ug35.onrender.com";

// Function to fetch task details by ID
function fetchTaskDetails(taskId) {
    console.log('Fetching task details....');
    fetch(`${baseURL}/api/tasks/${taskId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const task = data.task; // Ensure we access the task property correctly
            console.log(task);
            const taskDetailsDiv = document.getElementById('details-content');
            if (taskDetailsDiv) {
                taskDetailsDiv.innerHTML = `
                    <h3>${task.title || 'No title'}</h3>
                    <p>${task.description || 'No description'}</p>
                    <p>Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date'}</p>
                    <p>Status: ${task.status || 'No status'}</p>
                `;
            } else {
                console.error('Task details div not found');
            }
        })
        .catch(error => {
            console.log('Error fetching task details:', error);
        });
}

// Get the task ID from the URL
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');

    if (taskId) {
        fetchTaskDetails(taskId);
    } else {
        console.error('No task ID provided in the URL');
    }
});