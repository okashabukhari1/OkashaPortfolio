document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('projGrid');
  if (!grid) return;

  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error('Failed to load projects');

    const { projects } = await response.json();
    if (!Array.isArray(projects)) throw new Error('Invalid projects data');

    grid.innerHTML = projects.map(renderProjectCard).join('');
    grid.querySelectorAll('.pv-icon').forEach(image => {
      image.addEventListener('error', () => image.remove(), { once: true });
    });
    observeProjectCards(grid);
  } catch (error) {
    console.error('Error loading projects:', error);
    grid.innerHTML = '<p class="proj-desc">Projects could not be loaded. Please try again later.</p>';
  }

  grid.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    const card = event.target.closest('.proj-card[data-id]');
    if (card) window.location.href = `project-details.html?id=${encodeURIComponent(card.dataset.id)}`;
  });

  grid.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.proj-card[data-id]')) {
      event.preventDefault();
      event.target.click();
    }
  });
});

function renderProjectCard(project, index) {
  const status = project.status.toLowerCase();
  const statusClass = status === 'live' ? 'live' : status === 'completed' ? 'done' : 'dev';
  const statusIcon = statusClass === 'live' ? 'bi-circle-fill' : statusClass === 'done' ? 'bi-check-circle-fill' : 'bi-hourglass-split';
  const technologies = (project.technologies || []).map(technology => `<span class="ptag">${escapeHTML(technology)}</span>`).join('');
  const filters = (project.filters || []).map(escapeHTML).join(' ');
  const liveLink = project.liveUrl && project.liveUrl !== '#'
    ? `<a href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="proj-link-btn" aria-label="View ${escapeHTML(project.title)} live site" title="View Live"><i class="bi bi-arrow-up-right"></i></a>`
    : '';
  const githubLink = project.githubUrl && project.githubUrl !== '#'
    ? `<a href="${escapeHTML(project.githubUrl)}" target="_blank" rel="noopener noreferrer" class="proj-link-btn" aria-label="View ${escapeHTML(project.title)} on GitHub" title="View GitHub"><i class="bi bi-github"></i></a>`
    : '';

  return `
    <div class="proj-card card${project.featured ? ' proj-card-full' : ''} reveal" data-cat="${filters}" data-id="${escapeHTML(project.id)}" role="button" tabindex="0" aria-label="View ${escapeHTML(project.title)} project details">
      <div class="proj-visual pv${(index % 6) + 1}">
        <div class="pv-glow"></div>
        <div class="proj-status status-${statusClass}"><i class="bi ${statusIcon}"></i> ${escapeHTML(project.status)}</div>
        <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)} — ${escapeHTML(project.shortDescription)}" loading="lazy" width="220" height="160" class="pv-icon">
        <div class="pv-bg-label">${escapeHTML(project.title.toUpperCase())}</div>
      </div>
      <div class="proj-body">
        <div class="proj-cat">${escapeHTML(project.category)}</div>
        <h3 class="proj-title">${escapeHTML(project.title)}</h3>
        <p class="proj-desc">${escapeHTML(project.shortDescription)}</p>
        <div class="proj-foot">
          <div class="proj-tags">${technologies}</div>
          <div class="proj-links">${liveLink}${githubLink}</div>
        </div>
      </div>
    </div>`;
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function observeProjectCards(grid) {
  if (!('IntersectionObserver' in window)) {
    grid.querySelectorAll('.reveal').forEach(card => card.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  grid.querySelectorAll('.reveal').forEach(card => observer.observe(card));
}
