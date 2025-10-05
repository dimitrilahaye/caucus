// @ts-check

/**
 * Gestionnaires d'événements pour la page d'impro
 */

import { IMPRO_MESSAGES } from './improConstants.js';

/**
 * Crée un gestionnaire de sélection d'élève
 * @param {string} studentId
 * @param {Set<string>} selectedStudents
 * @param {function(): void} onUpdate
 * @returns {function(): void}
 */
export function createStudentToggleHandler(studentId, selectedStudents, onUpdate) {
  return () => {
    if (selectedStudents.has(studentId)) {
      selectedStudents.delete(studentId);
    } else {
      selectedStudents.add(studentId);
    }
    onUpdate();
  };
}

/**
 * Crée un gestionnaire "Tout sélectionner/dé-sélectionner"
 * @param {import('../../../core/entities/course.js').Course} course
 * @param {Set<string>} selectedStudents
 * @param {function(): void} onUpdate
 * @returns {function(): void}
 */
export function createSelectAllHandler(course, selectedStudents, onUpdate) {
  return () => {
    if (selectedStudents.size === course.students.length) {
      // Tout dé-sélectionner
      selectedStudents.clear();
    } else {
      // Tout sélectionner
      selectedStudents.clear();
      course.students.forEach(student => selectedStudents.add(student.id));
    }
    onUpdate();
  };
}

/**
 * Crée un gestionnaire de changement du nombre de lieux
 * @param {function(number): void} onPlacesCountChange
 * @returns {function(number): void}
 */
export function createPlacesCountHandler(onPlacesCountChange) {
  return (newCount) => {
    onPlacesCountChange(newCount);
  };
}

/**
 * Crée un gestionnaire de génération d'impro
 * @param {Set<string>} selectedStudents
 * @param {number} placesCount
 * @param {import('../../../core/entities/course.js').Course} course
 * @param {Object} deps
 * @param {function(any): void} onImproGenerated
 * @returns {function(): Promise<void>}
 */
export function createGenerateHandler(selectedStudents, placesCount, course, deps, onImproGenerated) {
  return async () => {
    // Validation des élèves
    const studentError = deps.validationUseCase.validateStudentSelection(selectedStudents, course);
    if (studentError) {
      alert(studentError);
      return;
    }

    // Validation du nombre de lieux
    const places = await deps.placesUseCase.list();
    const placesError = deps.validationUseCase.validatePlacesCount(placesCount, places.length);
    if (placesError) {
      alert(placesError);
      return;
    }

    try {
      const studentsToGenerate = course.students.filter(s => selectedStudents.has(s.id));
      const impro = await deps.improGenerationUseCase.generate(studentsToGenerate, placesCount);
      onImproGenerated(impro);
    } catch (error) {
      alert(`${IMPRO_MESSAGES.ERRORS.GENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de régénération de lieu
 * @param {Array} places
 * @param {number} index
 * @param {Object} deps
 * @param {function(): void} onUpdate
 * @returns {function(): Promise<void>}
 */
export function createPlaceRegenerateHandler(places, index, deps, onUpdate) {
  return async () => {
    try {
      const newPlace = await deps.regenerationUseCase.regeneratePlace(places, index);
      places[index] = newPlace;
      onUpdate();
    } catch (error) {
      alert(`${IMPRO_MESSAGES.ERRORS.REGENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de suppression de lieu
 * @param {Array} places
 * @param {number} index
 * @param {Object} deps
 * @param {function(): void} onUpdate
 * @returns {function(): Promise<void>}
 */
export function createPlaceDeleteHandler(places, index, deps, onUpdate) {
  return async () => {
    const placeName = places[index].name;
    const confirmed = await deps.deletionUseCase.confirmDeletion(
      IMPRO_MESSAGES.CONFIRMATIONS.DELETE_PLACE(placeName)
    );
    
    if (confirmed) {
      places.splice(index, 1);
      onUpdate();
    }
  };
}

/**
 * Crée un gestionnaire de régénération de personnage
 * @param {Array} assignments
 * @param {number} index
 * @param {Object} deps
 * @param {function(): void} onUpdate
 * @returns {function(): Promise<void>}
 */
export function createCharacterRegenerateHandler(assignments, index, deps, onUpdate) {
  return async () => {
    try {
      const newCharacter = await deps.regenerationUseCase.regenerateCharacter(assignments, index);
      assignments[index].character = newCharacter;
      onUpdate();
    } catch (error) {
      alert(`${IMPRO_MESSAGES.ERRORS.REGENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de régénération d'émotion
 * @param {Array} assignments
 * @param {number} index
 * @param {Object} deps
 * @param {function(): void} onUpdate
 * @returns {function(): Promise<void>}
 */
export function createMoodRegenerateHandler(assignments, index, deps, onUpdate) {
  return async () => {
    try {
      const newMood = await deps.regenerationUseCase.regenerateMood(assignments, index);
      assignments[index].mood = newMood;
      onUpdate();
    } catch (error) {
      alert(`${IMPRO_MESSAGES.ERRORS.REGENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de suppression d'élève de l'impro
 * @param {Array} assignments
 * @param {number} index
 * @param {Object} deps
 * @param {function(): void} onUpdate
 * @returns {function(): Promise<void>}
 */
export function createStudentDeleteHandler(assignments, index, deps, onUpdate) {
  return async () => {
    const studentName = assignments[index].student.name;
    const confirmed = await deps.deletionUseCase.confirmDeletion(
      IMPRO_MESSAGES.CONFIRMATIONS.DELETE_STUDENT(studentName)
    );
    
    if (confirmed) {
      assignments.splice(index, 1);
      onUpdate();
    }
  };
}
