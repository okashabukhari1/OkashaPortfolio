/* ══════════════════════════════════════════════════════════════════
   OKASHA BUKHARI — PORTFOLIO  |  project-details.js
   Dynamic Project Details Page Loader
   ═════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  const projectContent = document.getElementById('projectContent');

  /* ── Get project ID from URL parameter ─────────────────────── */
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    showError(projectContent, 'No project specified');
    return;
  }

  try {
    /* ── Fetch projects.json ───────────────────────────────── */
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error('Failed to load projects');
    
    const data = await response.json();
    const projects = data.projects;

    /* ── Find the matching project ────────────────────────── */
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      showError(projectContent, 'Project not found');
      return;
    }

    /* ── Update meta tags for SEO ────────────────────────── */
    updateMetaTags(project);

    /* ── Render the project details ──────────────────────── */
    renderProjectDetails(projectContent, project, projects);

    /* ── Add scroll reveal animations ────────────────────── */
    observeElements();

  } catch (error) {
    console.error('Error loading project:', error);
    showError(projectContent, 'Error loading project details');
  }
});

/* ══ UPDATE META TAGS FOR SEO ════════════════════════════════════════ */
function updateMetaTags(project) {
  const title = `${project.title} — Okasha Bukhari | Full Stack Developer`;
  const description = project.shortDescription;
  const imageUrl = `https://okashabukhari1.github.io/${project.heroImage}`;
  const url = `https://okashabukhari1.github.io/project-details.html?id=${project.id}`;

  // Update title
  document.title = title;

  // Update meta description
  document.querySelector('meta[name="description"]').setAttribute('content', description);
  document.querySelector('meta[name="keywords"]').setAttribute('content', `${project.title}, ${project.category}, Okasha Bukhari`);

  // Update Open Graph tags
  document.getElementById('ogTitle').setAttribute('content', title);
  document.getElementById('ogDescription').setAttribute('content', description);
  document.getElementById('ogImage').setAttribute('content', imageUrl);
  document.getElementById('ogUrl').setAttribute('content', url);
  document.getElementById('pageTitle').setAttribute('content', title);
  document.getElementById('pageDescription').setAttribute('content', description);
  document.getElementById('pageCanonical').setAttribute('href', url);

  // Update Twitter tags
  document.getElementById('twitterTitle').setAttribute('content', title);
  document.getElementById('twitterDescription').setAttribute('content', description);
  document.getElementById('twitterImage').setAttribute('content', imageUrl);
}

/* ══ RENDER PROJECT DETAILS ════════════════════════════════════════════ */
function renderProjectDetails(container, project, allProjects) {
  const statusColor = getStatusColor(project.status);
  const statusIcon = getStatusIcon(project.status);

  const heroHTML = `
    <section class="section" style="padding-top: 0;">
      <div class="project-hero fade-in">
        <img src="${project.heroImage}" alt="${project.title} — ${project.category}" loading="lazy">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <a href="projects.html" class="back-btn" title="Back to Projects" aria-label="Back to Projects">
            <i class="bi bi-arrow-left"></i>
          </a>
          <div class="hero-badge status-${statusColor}">
            <i class="bi ${statusIcon}"></i>
            ${project.status}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Project Header -->
        <div class="project-header fade-in fade-in-delay-1">
          <div class="project-meta">
            <div class="project-category">
              <i class="bi bi-tags"></i>
              ${project.category}
            </div>
            <h1>${project.title}</h1>
          </div>
          <div class="project-cta">
            ${project.liveUrl !== '#' ? `
              <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                <i class="bi bi-arrow-up-right"></i> View Live Demo
              </a>
            ` : ''}
            ${project.githubUrl !== '#' ? `
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-ghost">
                <i class="bi bi-github"></i> View on GitHub
              </a>
            ` : ''}
          </div>
        </div>

        <!-- Project Description -->
        <div class="project-description fade-in fade-in-delay-2">
          ${project.fullDescription}
        </div>

        <!-- Two Column Details -->
        <div class="details-grid fade-in fade-in-delay-3">
          <!-- Technologies -->
          <div class="detail-section">
            <h3><i class="bi bi-gear-fill" style="color: var(--cyan); margin-right: 8px;"></i>Technologies Used</h3>
            <div class="tech-list">
              ${project.technologies.map(tech => `
                <span class="tech-tag">
                  <i class="bi bi-check-circle"></i>
                  ${tech}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Features -->
          <div class="detail-section">
            <h3><i class="bi bi-star-fill" style="color: var(--cyan); margin-right: 8px;"></i>Key Features</h3>
            <div class="features-list">
              ${project.features.map(feature => `
                <div class="feature-item">
                  <i class="bi bi-check-lg"></i>
                  <span>${feature}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Related Projects -->
        <div class="related-projects fade-in fade-in-delay-3">
          <h2>Other Projects</h2>
          <div class="related-grid">
            ${allProjects
              .filter(p => p.id !== project.id)
              .slice(0, 3)
              .map((relProject, idx) => {
                const statusColor = getStatusColor(relProject.status);
                const statusIcon = getStatusIcon(relProject.status);
                const gradients = ['pv1', 'pv2', 'pv3', 'pv4', 'pv5', 'pv6'];
                const gradient = gradients[allProjects.findIndex(p => p.id === relProject.id) % gradients.length];
                return `
                <div class="proj-card card reveal" style="cursor: pointer;" onclick="window.location.href='project-details.html?id=${relProject.id}'" role="button" tabindex="0" aria-label="View ${relProject.title} project details">
                  <div class="proj-visual ${gradient}">
                    <div class="pv-glow"></div>
                    <div class="proj-status status-${statusColor}">
                      <i class="bi ${statusIcon}"></i> ${relProject.status}
                    </div>
                    <img src="${relProject.image}" alt="${relProject.title}" loading="lazy" class="pv-icon">
                    <div class="pv-bg-label" style="font-size: 1.8rem;">${relProject.title.split(' ')[0].toUpperCase()}</div>
                  </div>
                  <div class="proj-body">
                    <div class="proj-cat">
                      <i class="bi bi-folder"></i> ${relProject.category}
                    </div>
                    <h3 class="proj-title">${relProject.title}</h3>
                    <p class="proj-desc">${relProject.shortDescription}</p>
                    <div class="proj-foot">
                      <div class="proj-tags">
                        ${relProject.technologies.slice(0, 2).map(tech => `<span class="ptag">${tech}</span>`).join('')}
                      </div>
                      <div style="display: flex; align-items: center; gap: 8px; color: var(--cyan); font-size: .75rem; font-weight: 600;">
                        Details <i class="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              `;
              }).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  container.innerHTML = heroHTML;
  
  // Observe elements for animation
  observeElements();
}

/* ══ ERROR DISPLAY ════════════════════════════════════════════════════ */
function showError(container, message) {
  container.innerHTML = `
    <div style="min-height: 600px; display: flex; align-items: center; justify-content: center;">
      <div class="error-container fade-in">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h1>Project Not Found</h1>
        <p>${message || 'The project you are looking for does not exist or has been removed.'}</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="projects.html" class="btn-primary"><i class="bi bi-arrow-left"></i> Back to Projects</a>
          <a href="index.html" class="btn-ghost"><i class="bi bi-house"></i> Go Home</a>
        </div>
      </div>
    </div>
  `;
}

/* ══ HELPER: GET STATUS COLOR CLASS ═════════════════════════════════ */
function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'live':
      return 'live';
    case 'in development':
      return 'dev';
    case 'completed':
      return 'done';
    default:
      return 'dev';
  }
}

/* ══ HELPER: GET STATUS ICON ════════════════════════════════════════ */
function getStatusIcon(status) {
  switch (status.toLowerCase()) {
    case 'live':
      return 'bi-circle-fill';
    case 'in development':
      return 'bi-hourglass-split';
    case 'completed':
      return 'bi-check-circle-fill';
    default:
      return 'bi-hourglass-split';
  }
}

/* ══ SCROLL REVEAL ANIMATION ════════════════════════════════════════ */
function observeElements() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .fade-in').forEach(el => {
    revealObserver.observe(el);
  });
}

/* ══ SMOOTH SCROLL TO TOP ON PAGE LOAD ═════════════════════════════ */
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
