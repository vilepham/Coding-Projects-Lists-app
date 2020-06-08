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
        <td><i style="font-size:20px" class="fa delete">&#xf00d;</i></td>`
        if (project.status === false) {
            row.innerHTML += `<td><i style="font-size:20px" class="fa finished">&#xf00c;</i></td>`
        }
        // Append row to thread
        list.appendChild(row);
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
        let websites;
        if (localStorage.getItem('websites') === null) {
            websites = [];
        } else {
            websites = JSON.parse(localStorage.getItem('websites'));
        }
        
        return websites;
    }

    static displayProjects() {
        const websites = Storage.getProjects();

        websites.forEach(function(website) {
            const ui = new UI();
            ui.addProjectToList(website);
        });
    }

    static addProject(website) {
        const websites = Storage.getProjects();

        websites.push(website)

        localStorage.setItem('websites', JSON.stringify(websites));
    }

    static removeProject(concepts) {
        const websites = Storage.getProjects();
        
        websites.forEach(function(website, index) {
            if (website.concepts === concepts) {
                websites.splice(index, 1);
            }
        })

        localStorage.setItem('websites', JSON.stringify(websites));
    }
    static replaceProject(concepts, status) {
        const websites = Storage.getProjects();
        
        websites.forEach(function(website, index) {
            if (website.concepts === concepts && website.status === status) {
                websites.splice(index, 1);
            }
        })

        localStorage.setItem('websites', JSON.stringify(websites));
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
            Storage.removeProject(e.target.parentElement.previousElementSibling.previousElementSibling.textContent, e.target.parentElement.previousElementSibling.textContent);
            
        }
    }
});

// Event Listener for change status button
document.body.addEventListener('click', function(e) {
    const ui = new UI();
    if (e.target.classList.contains('finished')) {
        e.target.parentElement.previousElementSibling.previousElementSibling.textContent = true;
        e.target.parentElement.parentElement.remove();
        // Show success message
        ui.showAlert('Project updated', 'success');
        // Update LS
        const projectName = e.target.parentElement.parentElement.children[0].textContent;
        const startTime = e.target.parentElement.parentElement.children[1].textContent;
        const concepts = e.target.parentElement.parentElement.children[2].textContent;
        const status = true;


        const project = new Project(projectName, startTime, concepts, status);
        
        // Add project to list
        ui.addProjectToList(project);

        // Update LS by removing old status
        Storage.addProject(project);
        Storage.replaceProject(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent, false);

    }
});