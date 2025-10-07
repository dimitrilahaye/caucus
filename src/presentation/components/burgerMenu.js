// @ts-check

/**
 * Renders a simple burger menu with a link to the courses list.
 * @param {{ mountOn: HTMLElement }} params
 */
export function renderBurgerMenu({ mountOn }) {
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

  // Fonction pour vérifier si une impro est générée
  function hasGeneratedImpro() {
    const resultsSection = document.querySelector('.card[style*="display: block"]');
    return resultsSection && resultsSection.querySelector('h3')?.textContent === 'Impro générée';
  }

  // Close menu on navigation avec vérification d'impro
  panel.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */(e.target);
    if (target.tagName === 'A') {
      // Vérifier si une impro est générée
      if (hasGeneratedImpro()) {
        const confirmed = window.confirm('Vous allez perdre l\'impro générée. Continuer ?');
        if (!confirmed) {
          e.preventDefault();
          return;
        }
      }
      panel.setAttribute('hidden', '');
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */(e.target);
    const isMenuOpen = !panel.hasAttribute('hidden');
    
    if (isMenuOpen && 
        !container.contains(target) && 
        target !== button && 
        target !== panel) {
      panel.setAttribute('hidden', '');
    }
  });

  container.appendChild(button);
  container.appendChild(panel);
  mountOn.appendChild(container);
}


