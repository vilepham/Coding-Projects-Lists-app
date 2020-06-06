//Project Constructor
function Project(projectName, startTime, concepts, status) {
    this.projectName = projectName;
    this.startTime = startTime;
    this.concepts = concepts;
    this.status = status;
}

// UI Constructor
function UI() {};

UI.prototype.addProjectToList = function(project) {
    const list = document.getElementById('project-list');
    // Create tr element
    const row = document.createElement('tr')
    // Insert content in cols
    row.innerHTML = `
    <td>${project.projectName}</td>
    <td>${project.startTime}</td>
    <td>${project.concepts}</td>
    <td>${project.status}</td>
    <td><a href="#" class="delete">x</a></td>`
    // Append row to thread
    list.appendChild(row);

    // storeInLocalStorage(row.textContent);
}

UI.prototype.clearFields = function() {
    document.getElementById('project-name').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('concepts').value = '';
    document.getElementById('status').checked = false;
}

UI.prototype.showAlert = function(msg, className) {
    //Create alert element
    const alert = document.createElement('div');
    //Add error class
    alert.className = `alert ${className}`;
    //Alert content
    alert.appendChild(document.createTextNode(msg));
    //Prepend element
    document.querySelector('.container').insertBefore(alert, document.querySelector('h2'));

    //Timeout 3 seconds
    setTimeout(function() {
        document.querySelector('.alert').remove();
    }, 3000)
}

// Storage Constructor 
function Storage() {};

const storage = new Storage();

Storage.prototype.getProjects = function() {
    let projects;
    if (localStorage.getItem('projects') === null) {
        projects = [];
    } else {
        projects = JSON.parse(localStorage.getItem('projects'));
    }
    console.log(projects);
    return projects;
    
}

Storage.prototype.displayProjects = function() {
    const projects = storage.getProjects();

    projects.forEach(function(project) {
        const ui = new UI();
        ui.addProjectToList(project);
    });
}

Storage.prototype.addProject = function(project) {
    const projects = storage.getProjects();

    projects.push(project);

    localStorage.setItem('projects', JSON.stringify(projects));
}

Storage.prototype.removeProject = function(projectItem) {
    const projects = storage.getProjects();
    
    projects.forEach(function(project, index) {
        if (project.concepts === projectItem) {
            projects.splice(index, 1);
        }
    })

    localStorage.setItem('projects', JSON.stringify(projects));
}

// DOM load event listener
document.addEventListener('DOMContentLoaded', storage.displayProjects());

// Event Listeners for list form
document.getElementById('list-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const projectName = document.getElementById('project-name').value;
    const startTime = document.getElementById('start-time').value;
    const concepts = document.getElementById('concepts').value;
    const status = document.getElementById('status').checked;

    const project = new Project(projectName, startTime, concepts, status);

    const ui = new UI();

    // Validate input
    if (projectName === '' || startTime === '' || status === '') {
        // Show alert message
        ui.showAlert('Please fill the empty fields.', 'error');
    } else {
        // Show alert message
        ui.showAlert('Project saved', 'success');

        // Add project to list
        ui.addProjectToList(project);

        // Add to LS
        storage.addProject(project);

        // Clear input fields
        ui.clearFields();
    }
})

// Event Listener for delete
document.body.addEventListener('click', function(e) {
    const ui = new UI();
    if (e.target.classList.contains('delete')) {
        if (confirm('Delete project?')) {
            // Remove project
            e.target.parentElement.parentElement.remove();
            // Remove from LS
            storage.removeProject(e.target.parentElement.previousElementSibling.previousElementSibling.textContent)
            // Show success message
            ui.showAlert('Project deleted', 'success');
        }
    }
});