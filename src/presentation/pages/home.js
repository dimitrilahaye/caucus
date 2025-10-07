// @ts-check

/**
 * Minimal page bootstrap to verify composition is wired.
 * @param {{ root: HTMLElement }} params
 */
export function renderHome({ root }) {
  const info = document.createElement('p');
  info.textContent = 'Caucus — structure initialisée';
  root.appendChild(info);
}

