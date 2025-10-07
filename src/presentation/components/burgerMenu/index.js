// @ts-check

import { createBurgerContainer, createBurgerButton, createNavigationPanel } from './sections.js';
import { createBurgerButtonClickHandler, createNavigationClickHandler, createOutsideClickHandler } from './handlers.js';

/**
 * Renders a simple burger menu with a link to the courses list.
 * @param {{ mountOn: HTMLElement }} params
 */
export function renderBurgerMenu({ mountOn }) {
  // Créer les éléments
  const container = createBurgerContainer();
  const button = createBurgerButton();
  const { panel, links } = createNavigationPanel();

  // Créer les handlers
  const buttonClickHandler = createBurgerButtonClickHandler({ button, panel });
  const navigationClickHandler = createNavigationClickHandler({ panel, links });
  const outsideClickHandler = createOutsideClickHandler({ container, button, panel });

  // Attacher les event listeners
  button.addEventListener('click', buttonClickHandler);
  panel.addEventListener('click', navigationClickHandler);
  document.addEventListener('click', outsideClickHandler);

  // Assembler le composant
  container.appendChild(button);
  container.appendChild(panel);
  mountOn.appendChild(container);
}
