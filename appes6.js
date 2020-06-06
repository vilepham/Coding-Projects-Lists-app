// Project Class
class Project {
    constructor (projectName, startTime, concepts, status) {
        this.projectName = projectName;
        this.startTime = startTime;
        this.concepts = concepts;
        this.status = status;
    }
}

// UI Class
class UI {
    addProjectToList(project) {
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

    clearFields() {
        document.getElementById('project-name').value = '';
        document.getElementById('start-time').value = '';
        document.getElementById('concepts').value = '';
        document.getElementById('status').checked = false;
    }

    showAlert(msg, className) {
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
}

// Local Storage Class
class Storage {
    static getProjects() {
        let projects;
        if (localStorage.getItem('projects') === null) {
            projects = [];
        } else {
            projects = JSON.parse(localStorage.getItem('projects'));
        }
        
        return projects;
    }

    static displayProjects() {
        const projects = Storage.getProjects();

        projects.forEach(function(project) {
            const ui = new UI();
            ui.addProjectToList(project);
        });
    }

    static addProject(project) {
        const projects = Storage.getProjects();

        projects.push(project)

        localStorage.setItem('projects', JSON.stringify(projects));
    }

    static removeProject(projectItem) {
        const projects = Storage.getProjects();
        
        projects.forEach(function(project, index) {
            if (project.concepts === projectItem) {
                projects.splice(index, 1);
            }
        })

        localStorage.setItem('projects', JSON.stringify(projects));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Storage.displayProjects);

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
        Storage.addProject(project);
        console.log(Storage.addProject(project))

        // Clear input fields
        ui.clearFields();
    }
})

// Event Listener for delete
document.body.addEventListener('click', function(e) {
    const ui = new UI();
    if (e.target.classList.contains('delete')) {
        if (confirm('Delete project?')) {
            e.target.parentElement.parentElement.remove();
            // Show success message
            ui.showAlert('Project deleted', 'success');
            // Remove from LS
            Storage.removeProject(e.target.parentElement.previousElementSibling.previousElementSibling.textContent)
            console.log(e.target.parentElement.previousElementSibling.previousElementSibling.textContent)
        }
    }
});