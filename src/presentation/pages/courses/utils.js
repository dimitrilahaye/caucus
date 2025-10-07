// @ts-check

/**
 * Fonctions utilitaires pour la page des cours
 */

/**
 * Crée une carte de cours
 * @param {{ course: import('../../../core/entities/course.js').Course }} params
 * @returns {HTMLElement}
 */
export function createCourseCard({ course }) {
  const courseCard = document.createElement('a');
  courseCard.href = `#/courses/${encodeURIComponent(course.id)}`;
  courseCard.className = 'card-compact cursor-pointer';
  courseCard.style.display = 'block';
  courseCard.style.textDecoration = 'none';
  courseCard.style.color = 'inherit';
  
  const courseName = document.createElement('div');
  courseName.textContent = course.name;
  courseName.className = 'text-base font-medium';
  
  courseCard.appendChild(courseName);
  return courseCard;
}

/**
 * Crée un formulaire de création de cours
 * @param {{ onSubmitHandler: function(Event): Promise<void> }} params
 * @returns {HTMLElement}
 */
export function createCourseForm({ onSubmitHandler }) {
  const form = document.createElement('form');
  form.className = 'flex gap-sm mb-lg';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nom du cours';
  input.required = true;
  input.name = 'courseName';
  
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+';
  btn.className = 'btn-secondary btn-match-input';
  
  form.appendChild(input);
  form.appendChild(btn);
  
  form.addEventListener('submit', onSubmitHandler);
  
  return form;
}

/**
 * Crée un message d'état
 * @param {{ text: string, className?: string }} params
 * @returns {HTMLElement}
 */
export function createMessage({ text, className = 'text-center text-muted mb-md' }) {
  const message = document.createElement('p');
  message.textContent = text;
  message.className = className;
  return message;
}
