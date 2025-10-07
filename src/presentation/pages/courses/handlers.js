// @ts-check

/**
 * Gestionnaires d'événements pour la page des cours
 */

/**
 * Crée un gestionnaire de soumission du formulaire de cours
 * @param {{ coursesUseCase: import('../../../core/usecases/coursesUseCase.js').CoursesUseCase, onRefresh: function(): Promise<void> }} params
 * @returns {function(Event): Promise<void>}
 */
export function createCourseFormSubmitHandler({ coursesUseCase, onRefresh }) {
  return async (e) => {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.target);
    const input = /** @type {HTMLInputElement} */ (form.querySelector('input[name="courseName"]'));
    const name = input.value.trim();
    
    if (!name) return;
    
    try {
      await coursesUseCase.create({ name });
      input.value = '';
      await onRefresh();
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
    }
  };
}
