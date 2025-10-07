// @ts-check

/**
 * Sections d'affichage pour le composant Burger Menu
 */

/**
 * Crée le bouton burger
 * @returns {HTMLElement}
 */
export function createBurgerButton() {
  const button = document.createElement('button');
  button.className = 'burger-btn';
  button.setAttribute('aria-label', 'Menu');
  button.textContent = '☰';
  return button;
}

/**
 * Crée le panneau de navigation
 * @returns {{ panel: HTMLElement, list: HTMLElement, links: HTMLElement[] }}
 */
export function createNavigationPanel() {
  const panel = document.createElement('nav');
  panel.className = 'burger-panel';
  panel.setAttribute('hidden', '');

  const list = document.createElement('ul');
  
  const links = [
    { href: '#/courses', text: 'Cours' },
    { href: '#/places', text: 'Lieux' },
    { href: '#/moods', text: 'Émotions' },
    { href: '#/characters', text: 'Personnages' }
  ];

  const linkElements = links.map(linkData => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = linkData.href;
    link.textContent = linkData.text;
    li.appendChild(link);
    list.appendChild(li);
    return link;
  });

  panel.appendChild(list);
  return { panel, list, links: linkElements };
}

/**
 * Crée le conteneur principal
 * @returns {HTMLElement}
 */
export function createBurgerContainer() {
  return document.createElement('div');
}
