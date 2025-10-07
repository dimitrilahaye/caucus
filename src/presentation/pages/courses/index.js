// @ts-check

import { createCoursesPageSection, createCoursesList, createCoursesMessage } from './sections.js';
import { createCourseFormSubmitHandler } from './handlers.js';
import { createCourseCard, createCourseForm, createMessage } from './utils.js';
import { COURSES_MESSAGES } from './constants.js';

/**
 * @param {{ root: HTMLElement, deps: { coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase } }} params
 */
export function renderCoursesPage({ root, deps }) {
  root.innerHTML = '';

  // État de l'application
  let courses = [];

  // Fonctions de mise à jour
  async function refresh() {
    try {
      courses = await deps.coursesUseCase.list();
      updateUI();
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
    }
  }

  function updateUI() {
    // Mise à jour de la liste des cours dans le container principal
    const container = root.querySelector('.card');
    if (!container) return;
    
    const listElement = container.querySelector('.courses-list');
    if (listElement) {
      listElement.remove();
    }
    
    const newList = createCoursesList({ courses, createCourseCard });
    newList.className += ' courses-list';
    container.appendChild(newList);
    
    // Mise à jour du message dans le container principal
    const messageElement = container.querySelector('.courses-message');
    if (messageElement) {
      messageElement.remove();
    }
    
    const newMessage = createCoursesMessage({ courses, createMessage });
    newMessage.className += ' courses-message';
    container.appendChild(newMessage);
  }

  // Création de la section principale
  const formSubmitHandler = createCourseFormSubmitHandler({ 
    coursesUseCase: deps.coursesUseCase, 
    onRefresh: refresh 
  });
  const mainSection = createCoursesPageSection({ 
    courses, 
    onSubmitHandler: formSubmitHandler,
    createCourseCard,
    createCourseForm,
    createMessage
  });
  root.appendChild(mainSection);

  // Initialisation
  refresh();
}