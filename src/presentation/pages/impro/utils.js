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
