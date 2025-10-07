// @ts-check

/**
 * Composants réutilisables pour le composant CRUD List Page
 */

/**
 * Crée un élément éditable avec contenteditable
 * @param {{ initialValue: string, itemId: string, onBlur: (newName: string) => Promise<void>, onFocus: () => void, onKeydown: (e: KeyboardEvent) => void }} params
 * @returns {HTMLElement}
 */
export function createEditableElement({ initialValue, itemId, onBlur, onFocus, onKeydown }) {
  const editableName = document.createElement('span');
  editableName.textContent = initialValue;
  editableName.contentEditable = 'true';
  editableName.className = 'editable-name px-1 py-0.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500';
  editableName.style.minHeight = '1.5rem';
  editableName.style.display = 'inline-block';

  editableName.addEventListener('focus', onFocus);
  editableName.addEventListener('blur', () => onBlur(editableName.textContent.trim()));
  editableName.addEventListener('keydown', onKeydown);

  return editableName;
}

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
