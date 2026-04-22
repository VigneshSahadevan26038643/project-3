// Mock Database setup using LocalStorage
const DB_KEY_PROJECTS = 'nexfund_projects_v3';
const DB_KEY_UPDATES = 'nexfund_updates_v3';

function initDB() {
    if (!localStorage.getItem(DB_KEY_PROJECTS)) {
        const defaultProjects = [
            {
                id: 1,
                title: 'Quantum AI Assistant',
                description: 'A next-generation personalized AI that anticipates your needs.',
                goal: 50000,
                raised: 15400,
                image: './assets/quantum_ai_assistant.png'
            },
            {
                id: 2,
                title: 'Ocean Cleanup Drone',
                description: 'Autonomous solar-powered drones that collect ocean plastics.',
                goal: 100000,
                raised: 85000,
                image: './assets/ocean_cleanup_drone.png'
            },
            {
                id: 3,
                title: 'Neon Urban Garden',
                description: 'Modular, automated vertical hydroponic farms for apartment living.',
                goal: 25000,
                raised: 3200,
                image: './assets/neon_urban_garden.png'
            }
        ];
        localStorage.setItem(DB_KEY_PROJECTS, JSON.stringify(defaultProjects));
    }
    
    if (!localStorage.getItem(DB_KEY_UPDATES)) {
        localStorage.setItem(DB_KEY_UPDATES, JSON.stringify([]));
    }
}

// Pseudo API backend functions
const api = {
    getProjects: () => JSON.parse(localStorage.getItem(DB_KEY_PROJECTS) || '[]'),
    getUpdates: () => JSON.parse(localStorage.getItem(DB_KEY_UPDATES) || '[]'),
    saveProjects: (data) => localStorage.setItem(DB_KEY_PROJECTS, JSON.stringify(data)),
    saveUpdates: (data) => localStorage.setItem(DB_KEY_UPDATES, JSON.stringify(data))
};

// State
let projects = [];
let currentProject = null;

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const modalCreate = document.getElementById('modal-create');
const modalDetail = document.getElementById('modal-detail');
const modalContribute = document.getElementById('modal-contribute');
const detailView = document.getElementById('detail-view');

// Buttons
document.getElementById('btn-create-project').addEventListener('click', () => modalCreate.showModal());
document.getElementById('close-create').addEventListener('click', () => modalCreate.close());
document.getElementById('close-detail').addEventListener('click', () => modalDetail.close());
document.getElementById('close-contribute').addEventListener('click', () => modalContribute.close());

// Initialize
async function init() {
    initDB();
    await fetchProjects();
}

async function fetchProjects() {
    projects = api.getProjects();
    renderProjects();
}

function renderProjects() {
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const percent = Math.min((project.raised / project.goal) * 100, 100).toFixed(1);
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <img class="project-img" src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percent}%"></div>
                </div>
                <div class="funding-stats">
                    <span class="raised">$${project.raised.toLocaleString()} raised</span>
                    <span class="goal">$${project.goal.toLocaleString()} goal</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openProjectDetail(project.id));
        projectsGrid.appendChild(card);
    });
}

function openProjectDetail(id) {
    const allProjects = api.getProjects();
    const allUpdates = api.getUpdates();
    
    currentProject = allProjects.find(p => p.id === id);
    if (!currentProject) return;
    
    currentProject.updates = allUpdates.filter(u => u.project_id === id).sort((a,b) => b.id - a.id);
    
    renderProjectDetail();
    modalDetail.showModal();
}

function renderProjectDetail() {
    if (!currentProject) return;
    
    const percent = Math.min((currentProject.raised / currentProject.goal) * 100, 100).toFixed(1);
    
    let updatesHTML = '';
    if (currentProject.updates && currentProject.updates.length > 0) {
        updatesHTML = currentProject.updates.map(u => `
            <div class="update-item">
                <div class="update-date">${new Date(u.date).toLocaleDateString()}</div>
                <div>${u.content}</div>
            </div>
        `).join('');
    } else {
        updatesHTML = '<p style="color: var(--text-secondary)">No updates yet.</p>';
    }

    detailView.innerHTML = `
        <img class="detail-img" src="${currentProject.image}" alt="${currentProject.title}">
        <h2 class="detail-title">${currentProject.title}</h2>
        
        <div class="progress-container" style="height: 12px; margin-bottom: 0.5rem;">
            <div class="progress-bar" style="width: ${percent}%"></div>
        </div>
        <div class="funding-stats" style="margin-bottom: 2rem; font-size: 1.1rem;">
            <span class="raised">$${currentProject.raised.toLocaleString()} raised</span>
            <span class="goal">of $${currentProject.goal.toLocaleString()} goal</span>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="switchTab('about')">About</button>
            <button class="tab" onclick="switchTab('updates')">Updates (${currentProject.updates ? currentProject.updates.length : 0})</button>
        </div>

        <div id="tab-about" class="tab-content" style="display:block;">
            <p class="detail-desc">${currentProject.description}</p>
        </div>
        
        <div id="tab-updates" class="tab-content" style="display:none;">
            <div class="updates-list">
                ${updatesHTML}
            </div>
            
            <form id="form-update" style="margin-top: 2rem;">
                <div class="form-group">
                    <textarea id="update-content" rows="2" placeholder="Post a new update..." required></textarea>
                </div>
                <button type="submit" class="submit-btn" style="padding: 0.5rem;">Post Update</button>
            </form>
        </div>

        <div class="detail-actions">
            <button class="submit-btn success-btn" onclick="openContributeModal()">Back this Project</button>
        </div>
    `;

    setTimeout(() => {
        const updateForm = document.getElementById('form-update');
        if(updateForm) {
            updateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                postUpdate(document.getElementById('update-content').value);
                document.getElementById('update-content').value = '';
            });
        }
    }, 100);
}

window.switchTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('tab-about').style.display = tabName === 'about' ? 'block' : 'none';
    document.getElementById('tab-updates').style.display = tabName === 'updates' ? 'block' : 'none';
}

window.openContributeModal = function() {
    document.getElementById('contribute-project-title').textContent = currentProject.title;
    document.getElementById('form-contribute').reset();
    modalContribute.showModal();
}

// Form Handlers
document.getElementById('form-create').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('create-title').value;
    const randomSeed = Math.floor(Math.random() * 1000);
    const image = document.getElementById('create-image').value || `https://picsum.photos/seed/${randomSeed}/600/400`;
    const goal = parseFloat(document.getElementById('create-goal').value);
    const description = document.getElementById('create-desc').value;

    const allProjects = api.getProjects();
    const newProject = {
        id: allProjects.length > 0 ? Math.max(...allProjects.map(p => p.id)) + 1 : 1,
        title,
        description,
        goal,
        raised: 0,
        image
    };

    allProjects.push(newProject);
    api.saveProjects(allProjects);

    modalCreate.close();
    e.target.reset();
    fetchProjects();
});

document.getElementById('form-contribute').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('contribute-amount').value);
    
    const allProjects = api.getProjects();
    const projectIndex = allProjects.findIndex(p => p.id === currentProject.id);
    
    if (projectIndex !== -1) {
        allProjects[projectIndex].raised += amount;
        api.saveProjects(allProjects);
        
        modalContribute.close();
        openProjectDetail(currentProject.id);
        fetchProjects();
    }
});

function postUpdate(content) {
    const allUpdates = api.getUpdates();
    const newUpdate = {
        id: allUpdates.length > 0 ? Math.max(...allUpdates.map(u => u.id)) + 1 : 1,
        project_id: currentProject.id,
        content,
        date: new Date().toISOString()
    };
    
    allUpdates.push(newUpdate);
    api.saveUpdates(allUpdates);
    
    openProjectDetail(currentProject.id);
}

// Run init
init();
