// @ts-check

/**
 * Handlers pour la page des détails de cours
 */

/**
 * Crée un handler pour le focus du titre du cours (retourne une fonction)
 * @param {{ titleElement: HTMLElement }} params
 * @returns {function(): void}
 */
export function createTitleFocusHandlerFunction({ titleElement }) {
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
 * @param {{ titleElement: HTMLElement, course: import('../../../core/entities/course.js').Course, courseId: string, coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase, messages: Object, timeouts: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createTitleBlurHandlerFunction({ titleElement, course, courseId, coursesUseCase, messages, timeouts }) {
  return async () => {
    // Éviter les appels multiples pendant la sauvegarde
    if (titleElement.dataset.saving === 'true') return;
    
    // Ajouter une transition smooth pour les changements de couleur
    titleElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Restaurer le style normal
    titleElement.style.padding = '';
    titleElement.style.backgroundColor = '';
    titleElement.style.border = '';
    titleElement.style.color = '';
    
    // Gérer la sauvegarde
    const newName = titleElement.textContent.trim();
    if (newName && newName !== course.name) {
      try {
        // Marquer comme en cours de sauvegarde
        titleElement.dataset.saving = 'true';
        titleElement.contentEditable = 'false';
        
        await coursesUseCase.rename({ id: courseId, newName });
        course.name = newName; // Mettre à jour l'objet local
        
        // Feedback visuel de succès : fond vert avec texte blanc
        titleElement.style.backgroundColor = '#22c55e'; // green-500
        titleElement.style.color = 'white';
        titleElement.style.padding = '8px 12px'; // Ajouter du padding pendant la transition
        
        setTimeout(() => {
          // Retour à l'état normal avec transition smooth
          titleElement.style.backgroundColor = '';
          titleElement.style.color = '';
          titleElement.style.padding = ''; // Retirer le padding
          
          // Réactiver l'édition après la transition
          titleElement.contentEditable = 'true';
          titleElement.dataset.saving = 'false';
        }, 500); // 0.5 secondes
        
      } catch (error) {
        // En cas d'erreur, revenir à l'ancienne valeur
        titleElement.textContent = course.name;
        titleElement.style.backgroundColor = '#ef4444'; // red-500
        titleElement.style.color = 'white';
        
        setTimeout(() => {
          titleElement.style.backgroundColor = '';
          titleElement.style.color = '';
          
          // Réactiver l'édition après la transition d'erreur
          titleElement.contentEditable = 'true';
          titleElement.dataset.saving = 'false';
        }, timeouts.ERROR_FEEDBACK);
      }
    } else if (!newName) {
      // Si vide, revenir à l'ancienne valeur
      titleElement.textContent = course.name;
    }
  };
}

/**
 * Crée un handler pour les touches du titre du cours (retourne une fonction)
 * @param {{ titleElement: HTMLElement, course: import('../../../core/entities/course.js').Course }} params
 * @returns {function(KeyboardEvent): void}
 */
export function createTitleKeydownHandlerFunction({ titleElement, course }) {
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
 * @param {{ courseId: string, coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createDeleteCourseHandlerFunction({ courseId, coursesUseCase, messages }) {
  return async () => {
    const confirmed = window.confirm(messages.CONFIRMATIONS.DELETE_COURSE);
    if (!confirmed) return;
    const ok = await coursesUseCase.remove({ id: courseId });
    if (ok) {
      location.hash = '#/courses';
    }
  };
}

/**
 * Crée un handler pour le bouton de génération d'impro (retourne une fonction)
 * @param {{ courseId: string, coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createGenerateImproHandlerFunction({ courseId, coursesUseCase, messages }) {
  return async () => {
    const currentCourse = await coursesUseCase.getById({ id: courseId });
    if (!currentCourse || !currentCourse.students.length) {
      alert(messages.ERRORS.NO_STUDENTS_FOR_IMPRO);
      return;
    }
    // Rediriger vers la page d'impro
    location.hash = `#/courses/${courseId}/impro`;
  };
}

/**
 * Crée un handler pour l'ajout d'élève (retourne une fonction)
 * @param {{ input: HTMLElement, courseId: string, coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase, refreshStudents: () => Promise<void>, updateGenerateImproButton: () => Promise<void> }} params
 * @returns {function(): Promise<void>}
 */
export function createAddStudentHandlerFunction({ input, courseId, coursesUseCase, refreshStudents, updateGenerateImproButton }) {
  return async () => {
    const name = /** @type {HTMLInputElement} */ (input).value.trim();
    if (!name) return;
    await coursesUseCase.addStudent({ courseId, studentName: name });
    /** @type {HTMLInputElement} */ (input).value = '';
    refreshStudents();
    await updateGenerateImproButton();
  };
}

/**
 * Crée un handler pour l'édition d'un élève (retourne des fonctions handlers)
 * @param {{ editableElement: HTMLElement, student: import('../../../core/entities/course.js').Student, courseId: string, coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase, timeouts: Object }} params
 * @returns {{ focusHandler: function(): void, blurHandler: function(): Promise<void>, keydownHandler: function(KeyboardEvent): void }}
 */
export function createStudentEditHandlerFunction({ editableElement, student, courseId, coursesUseCase, timeouts }) {
  // Handler pour le focus
  const focusHandler = () => {
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
  };
  
  // Handler pour le blur
  const blurHandler = async () => {
    // Éviter les appels multiples pendant la sauvegarde
    if (editableElement.dataset.saving === 'true') return;
    
    // Ajouter une transition smooth pour les changements de couleur
    editableElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Restaurer le style normal
    editableElement.style.padding = '';
    editableElement.style.backgroundColor = '';
    editableElement.style.border = '';
    editableElement.style.color = '';
    
    // Gérer la sauvegarde
    const newName = editableElement.textContent.trim();
    if (newName && newName !== student.name) {
      try {
        // Marquer comme en cours de sauvegarde
        editableElement.dataset.saving = 'true';
        editableElement.contentEditable = 'false';
        
        await coursesUseCase.renameStudent({ courseId, studentId: student.id, newName });
        
        // Mettre à jour le nom de l'élève pour les prochaines comparaisons
        student.name = newName;
        
        // Feedback visuel de succès : fond vert avec texte blanc
        editableElement.style.backgroundColor = '#22c55e'; // green-500
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
        }, 500); // 0.5 secondes
        
      } catch (error) {
        // En cas d'erreur, revenir à l'ancienne valeur
        editableElement.textContent = student.name;
        editableElement.style.backgroundColor = '#ef4444'; // red-500
        editableElement.style.color = 'white';
        
        setTimeout(() => {
          editableElement.style.backgroundColor = '';
          editableElement.style.color = '';
          
          // Réactiver l'édition après la transition d'erreur
          editableElement.contentEditable = 'true';
          editableElement.dataset.saving = 'false';
        }, timeouts.ERROR_FEEDBACK);
      }
    } else if (!newName) {
      // Si vide, revenir à l'ancienne valeur
      editableElement.textContent = student.name;
    }
  };
  
  // Handler pour les touches
  const keydownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editableElement.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      editableElement.textContent = student.name;
      editableElement.blur();
    }
  };

  return { focusHandler, blurHandler, keydownHandler };
}

/**
 * Crée un handler pour la suppression d'un élève (retourne une fonction)
 * @param {{ student: import('../../../core/entities/course.js').Student, courseId: string, coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase, refreshStudents: () => Promise<void>, updateGenerateImproButton: () => Promise<void>, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createDeleteStudentHandlerFunction({ student, courseId, coursesUseCase, refreshStudents, updateGenerateImproButton, messages }) {
  return async () => {
    const confirmed = window.confirm(messages.CONFIRMATIONS.DELETE_STUDENT(student.name));
    if (!confirmed) return;
    const ok = await coursesUseCase.removeStudent({ courseId, studentId: student.id });
    if (ok) {
      refreshStudents();
      await updateGenerateImproButton();
    }
  };
}
