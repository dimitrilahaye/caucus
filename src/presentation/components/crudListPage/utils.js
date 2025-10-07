// @ts-check

/**
 * Composants réutilisables pour le composant CRUD List Page
 */

/**
 * Crée un bouton de suppression
 * @param {{ itemName: string, itemId: string, onClick: () => Promise<void> }} params
 * @returns {HTMLElement}
 */
export function createDeleteButton({ itemName, itemId, onClick }) {
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.textContent = '🗑️';
  deleteBtn.className = 'btn-danger btn-match-input';
  deleteBtn.addEventListener('click', onClick);
  return deleteBtn;
}

/**
 * Crée une carte d'élément avec contenu éditable et bouton de suppression
 * @param {{ item: { id: string, name: string }, editableElement: HTMLElement, deleteButton: HTMLElement }} params
 * @returns {HTMLElement}
 */
export function createItemCard({ item, editableElement, deleteButton }) {
  const itemCard = document.createElement('div');
  itemCard.className = 'card';
  itemCard.style.padding = '0.5rem 0.75rem';
  itemCard.style.minHeight = 'auto';
  
  const itemContent = document.createElement('div');
  itemContent.className = 'flex items-center justify-between gap-sm';
  
  itemContent.appendChild(editableElement);
  itemContent.appendChild(deleteButton);
  
  itemCard.appendChild(itemContent);
  return itemCard;
}

/**
 * Crée un message vide
 * @param {{ text: string, className?: string }} params
 * @returns {HTMLElement}
 */
export function createEmptyMessage({ text, className = 'text-center text-muted mb-md' }) {
  const emptyMsg = document.createElement('p');
  emptyMsg.className = className;
  emptyMsg.textContent = text;
  return emptyMsg;
}
