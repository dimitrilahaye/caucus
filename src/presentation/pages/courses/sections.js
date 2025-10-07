// @ts-check

/**
 * Sections d'affichage pour la page des cours
 */

/**
 * Crée la section principale de la page des cours
 * @param {{ courses: Array<import('../../../core/entities/course.js').Course>, onSubmitHandler: function(Event): Promise<void>, createCourseCard: function({ course: import('../../../core/entities/course.js').Course }): HTMLElement, createCourseForm: function({ onSubmitHandler: function(Event): Promise<void> }): HTMLElement, createMessage: function({ text: string }): HTMLElement }} params
 * @returns {HTMLElement}
 */
export function createCoursesPageSection({ courses, onSubmitHandler, createCourseCard, createCourseForm, createMessage }) {
  const container = document.createElement('div');
  container.className = 'card';

  // Titre
  const title = document.createElement('h1');
  title.textContent = 'Cours';
  title.className = 'text-center mb-lg';
  container.appendChild(title);

  // Formulaire de création
  const form = createCourseForm({ onSubmitHandler });
  container.appendChild(form);

  // Message d'état
  const message = createMessage({
    text: courses.length === 0 ? 'Créez votre premier cours' : ''
  });
  container.appendChild(message);

  // Liste des cours
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  
  courses.forEach(course => {
    const courseCard = createCourseCard({ course });
    list.appendChild(courseCard);
  });
  
  container.appendChild(list);
  return container;
}

/**
 * Crée la liste des cours
 * @param {{ courses: Array<import('../../../core/entities/course.js').Course>, createCourseCard: function({ course: import('../../../core/entities/course.js').Course }): HTMLElement }} params
 * @returns {HTMLElement}
 */
export function createCoursesList({ courses, createCourseCard }) {
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  
  courses.forEach(course => {
    const courseCard = createCourseCard({ course });
    list.appendChild(courseCard);
  });
  
  return list;
}

/**
 * Crée le message d'état des cours
 * @param {{ courses: Array<import('../../../core/entities/course.js').Course>, createMessage: function({ text: string }): HTMLElement }} params
 * @returns {HTMLElement}
 */
export function createCoursesMessage({ courses, createMessage }) {
  const text = courses.length === 0 ? 'Créez votre premier cours' : '';
  return createMessage({ text });
}
