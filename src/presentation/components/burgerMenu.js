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

  const liPlaces = document.createElement('li');
  const linkPlaces = document.createElement('a');
  linkPlaces.href = '#/places';
  linkPlaces.textContent = 'Lieux';
  liPlaces.appendChild(linkPlaces);
  list.appendChild(liPlaces);

  const liMoods = document.createElement('li');
  const linkMoods = document.createElement('a');
  linkMoods.href = '#/moods';
  linkMoods.textContent = 'Émotions';
  liMoods.appendChild(linkMoods);
  list.appendChild(liMoods);

  const liCharacters = document.createElement('li');
  const linkCharacters = document.createElement('a');
  linkCharacters.href = '#/characters';
  linkCharacters.textContent = 'Personnages';
  liCharacters.appendChild(linkCharacters);
  list.appendChild(liCharacters);
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


