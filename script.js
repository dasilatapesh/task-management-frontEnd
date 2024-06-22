console.log("Script connected");

    const baseURL = "https://task-management-ug35.onrender.com";

    document.addEventListener('DOMContentLoaded', () => {
        fetchTasks();
    });

    function fetchTasks() {
        console.log('Fetching tasks....');
        fetch(`${baseURL}/api/tasks/getAll`)
          .then(res => {
            console.log(res);
            return res.json();
          })
          .then(tasks => {
            console.log(tasks);
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach(task => {
              const taskElement = document.createElement('div');
              taskElement.className = `task ${task.status=="Pending"?"div-pending":task.status=="Completed"?"div-completed":"div-progress"}`;
              taskElement.innerHTML = `
                <div>
                  <h3>${task.title}</h3>
                  <p>${task.description}</p>
                  <p>Due Date: ${new Date(task.dueDate).toLocaleString()}</p>
                  <p>Status: 
                  <select onchange="updateTaskStatus('${task._id}', this.value)">
                      <option value="Pending" class="pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                      <option value="In-Progress" class="in-progress" ${task.status === 'In-Progress' ? 'selected' : ''}>In-Progress</option>
                      <option value="Completed" class="completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  </select>
                  </p>
                </div>
                <div>
                  <button id="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                  <button id="submit-btn" onclick="showUpdateForm('${task._id}', '${task.title}', '${task.description}', '${task.dueDate}', '${task.status}')">Update</button>
                  <button id="show-details" onClick="showDetails('${task._id}')">Show Detail</button>
                </div>
              `;
              taskList.appendChild(taskElement);
            });
          })
          .catch(error => {
            console.log('Error fetching tasks:', error);
          });
    }

    function showDetails(id) {
      window.open(`task.html?id=${id}`, '_blank');
  }
    
    function createTask() {
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-description').value;
      const dueDate = document.getElementById('task-due-date').value;
    
      fetch(`${baseURL}/api/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, dueDate }) 
      })
        .then(res => res.json())
        .then(task => {
          fetchTasks();
          document.getElementById('task-title').value = '';
          document.getElementById('task-description').value = '';
          document.getElementById('task-due-date').value = '';
          console.log("Task created.");
        })
        .catch(error => console.error('Error creating task:', error));
    }
    
    function deleteTask(id) {
      console.log('Deleting...');
      fetch(`${baseURL}/api//tasks/${id}`, {
        method: 'DELETE'
      })
      .then(res => {
        return res.json();
      })
      .then(() => {
          fetchTasks();
      })
      .catch(error => {
          console.error('Error deleting task:', error);
      });
    }

    function updateTaskStatus(id, status) {
      fetch(`${baseURL}/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
      })
      .then(res => res.json())
      .then(() => {
          fetchTasks();
      })
      .catch(error => console.error('Error updating status:', error));
    }
    
    function showUpdateForm(id, title, description, dueDate) {
      const updateForm = document.getElementById('update-form');
      const updateTitle = document.getElementById('update-title');
      const updateDescription = document.getElementById('update-description');
      const updateDueDate = document.getElementById('update-due-date');
      updateTitle.value = title;
      updateDescription.value = description;
      updateDueDate.value = dueDate;
      updateForm.style.display = 'block';

      updateForm.addEventListener('submit', function(event) {
          event.preventDefault();
          const updatedTitle = updateTitle.value;
          const updatedDescription = updateDescription.value;
          const updatedDueDate = updateDueDate.value;
   
          fetch(`${baseURL}/api/tasks/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ title: updatedTitle, description: updatedDescription, dueDate: updatedDueDate })
          })
          .then(res => res.json())
          .then(task => {
              fetchTasks();
              updateForm.style.display = 'none';
              console.log("Task updated.");
          })
          .catch(error => console.error('Error updating task:', error));
      });
    }