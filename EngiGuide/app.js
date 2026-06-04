// App State
let currentRoute = '#home';

// DOM Elements
const appRoot = document.getElementById('app-root');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Routing
function handleRouting() {
    const hash = window.location.hash || '#home';
    currentRoute = hash;

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash.split('/')[0]) {
            link.classList.add('active');
        }
    });

    navMenu.classList.remove('active');

    // Parse route
    if (hash === '#home') renderHome();
    else if (hash === '#branches') renderBranches();
    else if (hash.startsWith('#branch/')) renderBranchDetails(hash.split('/')[1]);
    else if (hash === '#companies') renderCompanies();
    else if (hash.startsWith('#company/')) renderCompanyDetails(hash.split('/')[1]);
    else if (hash === '#experiences') renderExperiences();
    else if (hash === '#about') renderAbout();
    else if (hash === '#contact') renderContact();
    else renderHome();

    window.scrollTo(0, 0);
}

window.addEventListener('hashchange', handleRouting);

// Templates & Render Functions
function renderHome() {
    const branchCards = DB.branches.map(b => `
        <div class="card branch-card" onclick="window.location.hash='#branch/${b.id}'">
            <div class="branch-icon">${b.code.charAt(0)}</div>
            <h3>${b.name}</h3>
            <p>${b.code}</p>
        </div>
    `).join('');

    appRoot.innerHTML = `
        <section class="hero">
            <h1>Engineering Career Explorer</h1>
            <p>Explore Top Companies, Eligibility Criteria, Selection Processes, and Interview Experiences</p>
            <div class="search-container">
                <input type="text" class="search-input" id="search-input" placeholder="Search for a company (e.g. Google)...">
            </div>
        </section>
        
        <h2 class="section-title">Explore by Branch</h2>
        <div class="grid">
            ${branchCards}
        </div>
    `;

    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            window.location.hash = `#companies`;
            // Normally would pass search query to companies view
        }
    });
}

function renderBranches() {
    renderHome(); // For this simple app, Branches is same as Home bottom section
}

function renderBranchDetails(branchId) {
    const branch = DB.branches.find(b => b.id === branchId);
    if (!branch) return renderHome();

    const branchCompanies = DB.companies.filter(c => c.branches.includes(branchId));

    let companiesHtml = branchCompanies.length > 0 ? branchCompanies.map(c => `
        <div class="card company-card" onclick="window.location.hash='#company/${c.id}'">
            <div class="company-header">
                <div class="company-logo-placeholder">${c.name.charAt(0)}</div>
                <div class="company-info">
                    <h3>${c.name}</h3>
                    <span>${c.industry}</span>
                </div>
            </div>
            <p style="color:var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">${c.desc.substring(0, 80)}...</p>
            <button class="btn">View Details</button>
        </div>
    `).join('') : `<div class="empty-state">No companies found for this branch yet.</div>`;

    appRoot.innerHTML = `
        <a href="#home" class="back-btn">&larr; Back to Branches</a>
        <div class="content-section" style="text-align: center; margin-bottom: 2rem;">
            <div class="branch-icon" style="margin: 0 auto 1rem;">${branch.code.charAt(0)}</div>
            <h1>${branch.name} (${branch.code})</h1>
            <p style="color: var(--text-secondary); max-width: 600px; margin: 1rem auto 0;">${branch.desc}</p>
        </div>
        
        <h2 class="section-title">Top Companies</h2>
        <div class="grid">
            ${companiesHtml}
        </div>
    `;
}

function renderCompanies() {
    const allCompanies = DB.companies.map(c => `
        <div class="card company-card" onclick="window.location.hash='#company/${c.id}'">
            <div class="company-header">
                <div class="company-logo-placeholder">${c.name.charAt(0)}</div>
                <div class="company-info">
                    <h3>${c.name}</h3>
                    <span>${c.industry}</span>
                </div>
            </div>
            <p style="color:var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">${c.desc.substring(0, 80)}...</p>
            <button class="btn">View Details</button>
        </div>
    `).join('');

    appRoot.innerHTML = `
        <h2 class="section-title">All Companies</h2>
        <div class="grid">
            ${allCompanies}
        </div>
    `;
}

function renderCompanyDetails(companyId) {
    const company = DB.companies.find(c => c.id === companyId);
    if (!company) return renderCompanies();

    const branchesNames = company.branches.map(bId => DB.branches.find(b => b.id === bId)?.code).join(', ');

    const processSteps = company.process.map((step, idx) => `
        <div class="timeline-item">
            <h4>Step ${idx + 1}: ${step}</h4>
        </div>
    `).join('');

    const exps = company.experiences.map(e => `
        <div class="exp-card">
            <div class="exp-header">
                <h4>Role: ${e.role}</h4>
                <span class="difficulty-badge ${e.difficulty}">${e.diffLabel}</span>
            </div>
            <div class="q-box">
                <h5>Technical Questions:</h5>
                <p>${e.tech}</p>
            </div>
            <div class="q-box">
                <h5>HR Questions:</h5>
                <p>${e.hr}</p>
            </div>
            <div class="q-box" style="margin-bottom:0;">
                <h5>Candidate Tips:</h5>
                <p style="font-style:italic;">"${e.tips}"</p>
            </div>
        </div>
    `).join('');

    appRoot.innerHTML = `
        <a href="javascript:history.back()" class="back-btn">&larr; Back</a>
        
        <div class="detail-header">
            <div class="detail-logo">${company.name.charAt(0)}</div>
            <div class="detail-title">
                <h1>${company.name}</h1>
                <span class="industry-badge">${company.industry}</span>
                <p style="margin-top: 0.5rem; color: var(--text-secondary); max-width: 800px;">${company.desc}</p>
            </div>
        </div>
        
        <div class="content-section">
            <h2>Eligibility Criteria</h2>
            <div class="criteria-list">
                <div class="criteria-item">
                    <h4>Minimum CGPA</h4>
                    <p>${company.criteria.cgpa}</p>
                </div>
                <div class="criteria-item">
                    <h4>Eligible Branches</h4>
                    <p>${branchesNames}</p>
                </div>
                <div class="criteria-item">
                    <h4>Backlogs Allowed</h4>
                    <p>${company.criteria.backlogs}</p>
                </div>
                <div class="criteria-item">
                    <h4>Graduation Year</h4>
                    <p>${company.criteria.graduation}</p>
                </div>
            </div>
        </div>
        
        <div class="content-section">
            <h2>Selection Process</h2>
            <div class="timeline">
                ${processSteps}
            </div>
        </div>
        
        <div class="content-section">
            <h2>Interview Experiences</h2>
            ${exps || '<p>No experiences shared yet.</p>'}
        </div>
    `;
}

function renderExperiences() {
    let allExps = '';
    DB.companies.forEach(c => {
        c.experiences.forEach(e => {
            allExps += `
                <div class="exp-card">
                    <div class="exp-header">
                        <h4>${c.name} - ${e.role}</h4>
                        <span class="difficulty-badge ${e.difficulty}">${e.diffLabel}</span>
                    </div>
                    <div class="q-box">
                        <h5>Technical Questions:</h5>
                        <p>${e.tech}</p>
                    </div>
                    <div class="q-box">
                        <h5>HR Questions:</h5>
                        <p>${e.hr}</p>
                    </div>
                    <button class="btn" style="margin-top: 1rem;" onclick="window.location.hash='#company/${c.id}'">View Company</button>
                </div>
            `;
        });
    });

    appRoot.innerHTML = `
        <h2 class="section-title">Interview Experiences</h2>
        <p style="margin-bottom: 2rem; color: var(--text-secondary);">Learn from the experiences of candidates who have gone through the selection process.</p>
        <div>
            ${allExps}
        </div>
    `;
}

function renderAbout() {
    appRoot.innerHTML = `
        <div class="content-section" style="max-width: 800px; margin: 0 auto;">
            <h2>About Engineering Career Explorer</h2>
            <p style="margin-bottom: 1rem;">Engineering Career Explorer is a dedicated platform designed to help engineering students navigate their career paths.</p>
            <p style="margin-bottom: 1rem;">Our mission is to bridge the gap between academia and industry by providing comprehensive information about top companies, their eligibility criteria, selection processes, and real-world interview experiences.</p>
            <p style="margin-bottom: 2rem;">Whether you're in Computer Science, Mechanical, Civil, or any other branch, we aim to provide the resources you need to prepare effectively for your dream job.</p>
            
            <h3 style="color: var(--primary-blue-dark); margin-bottom: 0.5rem; font-size: 1.25rem;">About the Creator</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">This platform was created by <strong>Sd.Arif</strong> to help engineering students explore top companies, eligibility criteria, recruitment processes, and interview experiences in one place.</p>
        </div>
    `;
}

function renderContact() {
    appRoot.innerHTML = `
        <div class="content-section" style="max-width: 800px; margin: 0 auto;">
            <h2>Contact Us</h2>
            <p style="margin-bottom: 2rem;">Have questions, feedback, or want to contribute an interview experience? Get in touch with us!</p>
            
            <form style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="display:block; margin-bottom: 4px; font-weight: 500;">Name</label>
                    <input type="text" class="search-input" style="border-radius: 8px; border: 1px solid var(--border-color); width: 100%; box-shadow: none;">
                </div>
                <div>
                    <label style="display:block; margin-bottom: 4px; font-weight: 500;">Email</label>
                    <input type="email" class="search-input" style="border-radius: 8px; border: 1px solid var(--border-color); width: 100%; box-shadow: none;">
                </div>
                <div>
                    <label style="display:block; margin-bottom: 4px; font-weight: 500;">Message</label>
                    <textarea class="search-input" style="border-radius: 8px; border: 1px solid var(--border-color); width: 100%; box-shadow: none; min-height: 150px;"></textarea>
                </div>
                <button type="button" class="btn" onclick="alert('Message sent successfully!')" style="align-self: flex-start;">Send Message</button>
            </form>
        </div>
    `;
}

// Init
handleRouting();
