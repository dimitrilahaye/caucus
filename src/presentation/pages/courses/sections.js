// @ts-check

/**
 * Sections d'affichage pour la page des cours
 */

import { createCourseCard, createCourseForm, createMessage } from './utils.js';

/**
 * Crée la section principale de la page des cours
 * @param {Array<import('../../../core/entities/course.js').Course>} courses
 * @param {function(Event): Promise<void>} onSubmitHandler
 * @returns {HTMLElement}
 */
export function createCoursesPageSection(courses, onSubmitHandler) {
  const container = document.createElement('div');
  container.className = 'card';

  // Titre
  const title = document.createElement('h1');
  title.textContent = 'Cours';
  title.className = 'text-center mb-lg';
  container.appendChild(title);

  // Formulaire de création
  const form = createCourseForm(onSubmitHandler);
  container.appendChild(form);

  // Message d'état
  const message = createMessage(
    courses.length === 0 ? 'Créez votre premier cours' : ''
  );
  container.appendChild(message);

  // Liste des cours
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  
  courses.forEach(course => {
    const courseCard = createCourseCard(course);
    list.appendChild(courseCard);
  });
  
  container.appendChild(list);
  return container;
}

/**
 * Crée la liste des cours
 * @param {Array<import('../../../core/entities/course.js').Course>} courses
 * @returns {HTMLElement}
 */
export function createCoursesList(courses) {
  const list = document.createElement('div');
  list.className = 'flex flex-col gap-sm';
  
  courses.forEach(course => {
    const courseCard = createCourseCard(course);
    list.appendChild(courseCard);
  });
  
  return list;
}

/**
 * Crée le message d'état des cours
 * @param {Array<import('../../../core/entities/course.js').Course>} courses
 * @returns {HTMLElement}
 */
export function createCoursesMessage(courses) {
  const text = courses.length === 0 ? 'Créez votre premier cours' : '';
  return createMessage(text);
}
