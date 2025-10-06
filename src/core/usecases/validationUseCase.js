// @ts-check

/**
 * Use-case pour la validation des données d'impro
 */

/**
 * @typedef {object} ValidationUseCase
 * @property {(selectedStudents: Set<string>, course: import('../entities/course.js').Course) => string|null} validateStudentSelection
 * @property {(placesCount: number, availablePlaces: number) => string|null} validatePlacesCount
 */

/**
 * Crée le use-case de validation
 * @returns {ValidationUseCase}
 */
export function createValidationUseCase() {
  return {
    validateStudentSelection(selectedStudents, course) {
      if (selectedStudents.size === 0) {
        return 'Sélectionnez au moins un élève';
      }
      
      if (selectedStudents.size > course.students.length) {
        return 'Trop d\'élèves sélectionnés';
      }
      
      return null;
    },

    validatePlacesCount(placesCount, availablePlaces) {
      if (placesCount < 1) {
        return 'Au moins un lieu est requis';
      }
      
      if (placesCount > availablePlaces) {
        return `Maximum ${availablePlaces} lieu${availablePlaces > 1 ? 'x' : ''} disponible${availablePlaces > 1 ? 's' : ''}`;
      }
      
      return null;
    }
  };
}
