// @ts-check

import { COURSE_DETAILS_MESSAGES, COURSE_DETAILS_TIMEOUTS } from './courseDetailsConstants.js';

/**
 * Handlers pour la page des détails de cours
 */

/**
 * Crée un handler pour le focus du titre du cours (retourne une fonction)
 * @param {HTMLElement} titleElement
 * @returns {function(): void}
 */
export function createTitleFocusHandlerFunction(titleElement) {
  return () => {
    titleElement.style.padding = '8px 12px';
    titleElement.style.backgroundColor = '';
    titleElement.style.border = '1px solid #dee2e6';
    
    // Positionner le curseur à la fin du texte
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel) {
        range.selectNodeContents(titleElement);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 0);
  };
}

/**
 * Crée un handler pour le blur du titre du cours (retourne une fonction)
 * @param {HTMLElement} titleElement
 * @param {import('../../../core/entities/course.js').Course} course
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @returns {function(): Promise<void>}
 */
export function createTitleBlurHandlerFunction(titleElement, course, courseId, coursesUseCase) {
  return async () => {
    // Restaurer le style normal
    titleElement.style.padding = '';
    titleElement.style.backgroundColor = '';
    titleElement.style.border = '';
    
    // Gérer la sauvegarde
    const newName = titleElement.textContent.trim();
    if (newName && newName !== course.name) {
      try {
        await coursesUseCase.rename(courseId, newName);
        course.name = newName; // Mettre à jour l'objet local
        // Feedback visuel de succès
        titleElement.style.backgroundColor = '#d4edda';
        setTimeout(() => {
          titleElement.style.backgroundColor = '';
        }, COURSE_DETAILS_TIMEOUTS.SUCCESS_FEEDBACK);
      } catch (error) {
        // En cas d'erreur, revenir à l'ancienne valeur
        titleElement.textContent = course.name;
        titleElement.style.backgroundColor = '#f8d7da';
        setTimeout(() => {
          titleElement.style.backgroundColor = '';
        }, COURSE_DETAILS_TIMEOUTS.ERROR_FEEDBACK);
      }
    } else if (!newName) {
      // Si vide, revenir à l'ancienne valeur
      titleElement.textContent = course.name;
    }
  };
}

/**
 * Crée un handler pour les touches du titre du cours (retourne une fonction)
 * @param {HTMLElement} titleElement
 * @param {import('../../../core/entities/course.js').Course} course
 * @returns {function(KeyboardEvent): void}
 */
export function createTitleKeydownHandlerFunction(titleElement, course) {
  return (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleElement.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      titleElement.textContent = course.name;
      titleElement.blur();
    }
  };
}

/**
 * Crée un handler pour la suppression du cours (retourne une fonction)
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @returns {function(): Promise<void>}
 */
export function createDeleteCourseHandlerFunction(courseId, coursesUseCase) {
  return async () => {
    const confirmed = window.confirm(COURSE_DETAILS_MESSAGES.CONFIRMATIONS.DELETE_COURSE);
    if (!confirmed) return;
    const ok = await coursesUseCase.remove(courseId);
    if (ok) {
      location.hash = '#/courses';
    }
  };
}

/**
 * Crée un handler pour le bouton de génération d'impro (retourne une fonction)
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @returns {function(): Promise<void>}
 */
export function createGenerateImproHandlerFunction(courseId, coursesUseCase) {
  return async () => {
    const currentCourse = await coursesUseCase.getById(courseId);
    if (!currentCourse || !currentCourse.students.length) {
      alert(COURSE_DETAILS_MESSAGES.ERRORS.NO_STUDENTS_FOR_IMPRO);
      return;
    }
    // Rediriger vers la page d'impro
    location.hash = `#/courses/${courseId}/impro`;
  };
}

/**
 * Crée un handler pour l'ajout d'élève (retourne une fonction)
 * @param {HTMLElement} input
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @param {() => Promise<void>} refreshStudents
 * @param {() => Promise<void>} updateGenerateImproButton
 * @returns {function(): Promise<void>}
 */
export function createAddStudentHandlerFunction(input, courseId, coursesUseCase, refreshStudents, updateGenerateImproButton) {
  return async () => {
    const name = /** @type {HTMLInputElement} */ (input).value.trim();
    if (!name) return;
    await coursesUseCase.addStudent(courseId, name);
    /** @type {HTMLInputElement} */ (input).value = '';
    refreshStudents();
    await updateGenerateImproButton();
  };
}

/**
 * Crée un handler pour l'édition d'un élève (retourne une fonction)
 * @param {HTMLElement} editableElement
 * @param {import('../../../core/entities/course.js').Student} student
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @returns {void}
 */
export function createStudentEditHandlerFunction(editableElement, student, courseId, coursesUseCase) {
  // Gestion du focus
  editableElement.addEventListener('focus', () => {
    editableElement.style.padding = '4px 8px';
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
  });
  
  // Gestion du blur
  editableElement.addEventListener('blur', async () => {
    // Restaurer le style normal
    editableElement.style.padding = '';
    editableElement.style.backgroundColor = '';
    editableElement.style.border = '';
    
    // Gérer la sauvegarde
    const newName = editableElement.textContent.trim();
    if (newName && newName !== student.name) {
      try {
        await coursesUseCase.renameStudent(courseId, student.id, newName);
        // Feedback visuel de succès
        editableElement.style.backgroundColor = '#d4edda';
        setTimeout(() => {
          editableElement.style.backgroundColor = '';
        }, COURSE_DETAILS_TIMEOUTS.SUCCESS_FEEDBACK);
      } catch (error) {
        // En cas d'erreur, revenir à l'ancienne valeur
        editableElement.textContent = student.name;
        editableElement.style.backgroundColor = '#f8d7da';
        setTimeout(() => {
          editableElement.style.backgroundColor = '';
        }, COURSE_DETAILS_TIMEOUTS.ERROR_FEEDBACK);
      }
    } else if (!newName) {
      // Si vide, revenir à l'ancienne valeur
      editableElement.textContent = student.name;
    }
  });
  
  // Gestion des touches
  editableElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableElement.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      editableElement.textContent = student.name;
      editableElement.blur();
    }
  });
}

/**
 * Crée un handler pour la suppression d'un élève (retourne une fonction)
 * @param {import('../../../core/entities/course.js').Student} student
 * @param {string} courseId
 * @param {import('../../../core/usecases/coursesUseCase.js').CoursesUseCase} coursesUseCase
 * @param {() => Promise<void>} refreshStudents
 * @param {() => Promise<void>} updateGenerateImproButton
 * @returns {function(): Promise<void>}
 */
export function createDeleteStudentHandlerFunction(student, courseId, coursesUseCase, refreshStudents, updateGenerateImproButton) {
  return async () => {
    const confirmed = window.confirm(COURSE_DETAILS_MESSAGES.CONFIRMATIONS.DELETE_STUDENT(student.name));
    if (!confirmed) return;
    const ok = await coursesUseCase.removeStudent(courseId, student.id);
    if (ok) {
      refreshStudents();
      await updateGenerateImproButton();
    }
  };
}
