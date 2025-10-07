// @ts-check

/**
 * Gestionnaires d'événements pour le composant Burger Menu
 */

/**
 * Crée un handler pour le clic sur le bouton burger
 * @param {{ button: HTMLElement, panel: HTMLElement }} params
 * @returns {() => void}
 */
export function createBurgerButtonClickHandler({ button, panel }) {
  return () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  };
}

/**
 * Crée un handler pour la navigation (fermeture du menu)
 * @param {{ panel: HTMLElement, links: HTMLElement[] }} params
 * @returns {(e: Event) => void}
 */
export function createNavigationClickHandler({ panel, links }) {
  return (e) => {
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
  };
}

/**
 * Crée un handler pour fermer le menu en cliquant à l'extérieur
 * @param {{ container: HTMLElement, button: HTMLElement, panel: HTMLElement }} params
 * @returns {(e: Event) => void}
 */
export function createOutsideClickHandler({ container, button, panel }) {
  return (e) => {
    const target = /** @type {HTMLElement} */(e.target);
    const isMenuOpen = !panel.hasAttribute('hidden');
    
    if (isMenuOpen && 
        !container.contains(target) && 
        target !== button && 
        target !== panel) {
      panel.setAttribute('hidden', '');
    }
  };
}

/**
 * Fonction utilitaire pour vérifier si une impro est générée
 * @returns {boolean}
 */
function hasGeneratedImpro() {
  const resultsSection = document.querySelector('.card[style*="display: block"]');
  return !!(resultsSection && resultsSection.querySelector('h3')?.textContent === 'Impro générée');
}
