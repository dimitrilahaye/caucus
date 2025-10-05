// @ts-check

/**
 * Renders a simple burger menu with a link to the courses list.
 * @param {HTMLElement} mountOn typically document.body
 */
export function renderBurgerMenu(mountOn) {
  const container = document.createElement('div');

  const button = document.createElement('button');
  button.className = 'burger-btn';
  button.setAttribute('aria-label', 'Menu');
  button.textContent = '☰';

  const panel = document.createElement('nav');
  panel.className = 'burger-panel';
  panel.setAttribute('hidden', '');

  const list = document.createElement('ul');
  const liCourses = document.createElement('li');
  const linkCourses = document.createElement('a');
  linkCourses.href = '#/courses';
  linkCourses.textContent = 'Cours';
  liCourses.appendChild(linkCourses);
  list.appendChild(liCourses);
  panel.appendChild(list);

  button.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  });

  // Close menu on navigation
  panel.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */(e.target);
    if (target.tagName === 'A') {
      panel.setAttribute('hidden', '');
    }
  });

  container.appendChild(button);
  container.appendChild(panel);
  mountOn.appendChild(container);
}


