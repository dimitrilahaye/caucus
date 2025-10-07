// @ts-check

/**
 * Fonctions utilitaires pour la page d'impro
 */

/**
 * Crée une carte d'élève avec checkbox
 * @param {{ student: import('../../../core/entities/course.js').Student, isSelected: boolean, onToggle: function(string): void }} params
 * @returns {HTMLElement}
 */
export function createStudentCard({ student, isSelected, onToggle }) {
  const studentCard = document.createElement('div');
  studentCard.className = 'card p-sm';
  
  const label = document.createElement('label');
  label.className = 'flex items-center gap-xs cursor-pointer w-full';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = student.id;
  checkbox.checked = isSelected;
  
  checkbox.addEventListener('change', () => {
    onToggle(student.id);
  });
  
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(student.name));
  studentCard.appendChild(label);
  
  return studentCard;
}

/**
 * Crée une carte de lieu avec boutons de régénération et suppression
 * @param {{ place: import('../../../core/entities/place.js').Place, onRegenerate: function(): Promise<void>, onDelete: function(): Promise<void>, canDelete: boolean }} params
 * @returns {HTMLElement}
 */
export function createPlaceCard({ place, onRegenerate, onDelete, canDelete }) {
  const placeCard = document.createElement('div');
  placeCard.className = 'card p-sm';
  
  const placeContent = document.createElement('div');
  placeContent.className = 'inline-edit-container';
  
  const placeName = document.createElement('span');
  placeName.textContent = place.name;
  placeName.className = 'font-medium text-sm';
  
  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';
  
  const regenerateBtn = createRegenerateButton({ text: '🔄', onClick: onRegenerate, className: 'btn-secondary btn-compact' });
  const deleteBtn = createDeleteButton({ text: '🗑️', onClick: onDelete, className: 'btn-danger btn-compact', disabled: !canDelete });
  
  btnGroup.appendChild(regenerateBtn);
  btnGroup.appendChild(deleteBtn);
  
  placeContent.appendChild(placeName);
  placeContent.appendChild(btnGroup);
  placeCard.appendChild(placeContent);
  
  return placeCard;
}

/**
 * Crée une carte d'assignment (élève + personnage + émotion)
 * @param {{ assignment: import('../../../core/entities/impro.js').ImproAssignment, onRegenerateCharacter: function(): Promise<void>, onRegenerateMood: function(): Promise<void>, onDeleteStudent: function(): Promise<void>, canDeleteStudent: boolean }} params
 * @returns {HTMLElement}
 */
export function createAssignmentCard({ assignment, onRegenerateCharacter, onRegenerateMood, onDeleteStudent, canDeleteStudent }) {
  const assignmentCard = document.createElement('div');
  assignmentCard.className = 'card p-sm';
  
  // Nom de l'élève
  const studentName = document.createElement('div');
  studentName.className = 'text-base font-semibold mb-xs';
  studentName.textContent = assignment.student.name;
  assignmentCard.appendChild(studentName);
  
  // Personnage
  const characterContainer = document.createElement('div');
  characterContainer.className = 'flex justify-between items-center mb-xs';
  
  const characterSpan = document.createElement('span');
  characterSpan.textContent = assignment.character.name;
  characterSpan.className = 'font-medium text-sm';
  
  const regenerateCharacterBtn = createRegenerateButton({ text: '🔄', onClick: onRegenerateCharacter, className: 'btn-secondary btn-match-input' });
  
  characterContainer.appendChild(characterSpan);
  characterContainer.appendChild(regenerateCharacterBtn);
  assignmentCard.appendChild(characterContainer);
  
  // Émotion
  const moodContainer = document.createElement('div');
  moodContainer.className = 'flex justify-between items-center mb-xs';
  
  const moodSpan = document.createElement('span');
  moodSpan.textContent = assignment.mood.name;
  moodSpan.className = 'text-secondary text-sm';
  
  const regenerateMoodBtn = createRegenerateButton({ text: '🔄', onClick: onRegenerateMood, className: 'btn-secondary btn-match-input' });
  
  moodContainer.appendChild(moodSpan);
  moodContainer.appendChild(regenerateMoodBtn);
  assignmentCard.appendChild(moodContainer);
  
  // Bouton de suppression
  const deleteStudentContainer = document.createElement('div');
  deleteStudentContainer.className = 'flex justify-end mt-xs';
  
  const deleteStudentBtn = createDeleteButton({ text: '🗑️ Supprimer l\'élève de l\'impro', onClick: onDeleteStudent, className: 'btn-danger btn-sm', disabled: !canDeleteStudent });
  
  deleteStudentContainer.appendChild(deleteStudentBtn);
  assignmentCard.appendChild(deleteStudentContainer);
  
  return assignmentCard;
}

/**
 * Crée un bouton de régénération générique
 * @param {{ text: string, onClick: function(): Promise<void>, className?: string }} params
 * @returns {HTMLElement}
 */
export function createRegenerateButton({ text, onClick, className = 'btn-secondary btn-match-input' }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;
  
  button.addEventListener('click', async () => {
    try {
      await onClick();
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  });
  
  return button;
}

/**
 * Crée un bouton de suppression générique
 * @param {{ text: string, onClick: function(): Promise<void>, className?: string, disabled?: boolean }} params
 * @returns {HTMLElement}
 */
export function createDeleteButton({ text, onClick, className = 'btn-danger btn-match-input', disabled = false }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;
  button.disabled = disabled;
  
  button.addEventListener('click', async () => {
    try {
      await onClick();
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  });
  
  return button;
}

/**
 * Affiche un feedback visuel sur un bouton
 * @param {{ button: HTMLButtonElement, originalText: string, successText: string, errorText: string, action: function(): Promise<boolean> }} params
 */
export async function showFeedback({ button, originalText, successText, errorText, action }) {
  button.textContent = '⏳';
  button.disabled = true;
  
  try {
    const success = await action();
    if (success) {
      button.textContent = successText;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    } else {
      button.textContent = errorText;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    }
  } catch (error) {
    button.textContent = errorText;
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1000);
  }
}
