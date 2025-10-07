// @ts-check

/**
 * Gestionnaires d'événements pour le composant CRUD List Page
 */

/**
 * Crée le gestionnaire de focus pour un élément éditable
 * @param {{ editableElement: HTMLElement }} params
 * @returns {() => void}
 */
export function createEditableFocusHandler({ editableElement }) {
  return () => {
    editableElement.style.padding = '8px 12px';
    editableElement.style.backgroundColor = '';
    editableElement.style.border = '1px solid #dee2e6';
    
    // Positionner le curseur à la fin du texte
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel) {
        range.selectNodeContents(editableElement);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 0);
  };
}

/**
 * Crée le gestionnaire de blur pour un élément éditable
 * @param {{ editableElement: HTMLElement, initialValue: string, itemId: string, useCase: Object, onSuccess: () => void, timeouts: Object, colors: Object }} params
 * @returns {(newName: string) => Promise<void>}
 */
export function createEditableBlurHandler({ editableElement, initialValue, itemId, useCase, onSuccess, timeouts, colors }) {
  return async (newName) => {
    // Éviter les appels multiples pendant la sauvegarde
    if (editableElement.dataset.saving === 'true') return;
    
    // Ajouter une transition smooth pour les changements de couleur
    editableElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Restaurer le style normal
    editableElement.style.padding = '4px 8px';
    editableElement.style.backgroundColor = '';
    editableElement.style.border = '';
    editableElement.style.color = '';
    
    // Gérer la sauvegarde
    if (newName && newName !== initialValue) {
      try {
        // Marquer comme en cours de sauvegarde
        editableElement.dataset.saving = 'true';
        editableElement.contentEditable = 'false';
        
        await useCase.rename(itemId, newName);
        
        // Feedback visuel de succès : fond vert avec texte blanc
        editableElement.style.backgroundColor = colors.SUCCESS_COLOR;
        editableElement.style.color = 'white';
        editableElement.style.padding = '8px 12px'; // Ajouter du padding pendant la transition
        
        setTimeout(() => {
          // Retour à l'état normal avec transition smooth
          editableElement.style.backgroundColor = '';
          editableElement.style.color = '';
          editableElement.style.padding = ''; // Retirer le padding
          
          // Réactiver l'édition après la transition
          editableElement.contentEditable = 'true';
          editableElement.dataset.saving = 'false';
        }, timeouts.TRANSITION_DURATION);
        
        onSuccess();
        
      } catch (error) {
        // En cas d'erreur, revenir à l'ancienne valeur
        editableElement.textContent = initialValue;
        editableElement.style.backgroundColor = colors.ERROR_COLOR;
        editableElement.style.color = 'white';
        
        setTimeout(() => {
          editableElement.style.backgroundColor = '';
          editableElement.style.color = '';
          
          // Réactiver l'édition après la transition d'erreur
          editableElement.contentEditable = 'true';
          editableElement.dataset.saving = 'false';
        }, timeouts.ERROR_FEEDBACK_DURATION);
      }
    } else if (!newName) {
      // Si vide, revenir à l'ancienne valeur
      editableElement.textContent = initialValue;
    }
  };
}

/**
 * Crée le gestionnaire de touches pour un élément éditable
 * @param {{ editableElement: HTMLElement, initialValue: string }} params
 * @returns {(e: KeyboardEvent) => void}
 */
export function createEditableKeydownHandler({ editableElement, initialValue }) {
  return (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableElement.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      editableElement.textContent = initialValue;
      editableElement.blur();
    }
  };
}

