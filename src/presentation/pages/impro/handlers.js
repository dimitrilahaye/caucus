// @ts-check

/**
 * Gestionnaires d'événements pour la page d'impro
 */

/**
 * Crée un gestionnaire de sélection d'élève
 * @param {{ studentId: string, selectedStudents: Set<string>, onUpdate: function(): void }} params
 * @returns {function(): void}
 */
export function createStudentToggleHandler({ studentId, selectedStudents, onUpdate }) {
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
 * @param {{ course: import('../../../core/entities/course.js').Course, selectedStudents: Set<string>, onUpdate: function(): void }} params
 * @returns {function(): void}
 */
export function createSelectAllHandler({ course, selectedStudents, onUpdate }) {
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
 * @param {{ onPlacesCountChange: function(number): void }} params
 * @returns {function(number): void}
 */
export function createPlacesCountHandler({ onPlacesCountChange }) {
  return (newCount) => {
    onPlacesCountChange(newCount);
  };
}

/**
 * Crée un gestionnaire de génération d'impro
 * @param {{ selectedStudents: Set<string>, placesCount: number, course: import('../../../core/entities/course.js').Course, deps: Object, onImproGenerated: function(any): void, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createGenerateHandler({ selectedStudents, placesCount, course, deps, onImproGenerated, messages }) {
  return async () => {
    // Validation des élèves
    const studentError = deps.validationUseCase.validateStudentSelection({ selectedStudents, course });
    if (studentError) {
      alert(studentError);
      return;
    }

    // Validation du nombre de lieux
    const places = await deps.placesUseCase.list();
    const placesError = deps.validationUseCase.validatePlacesCount({ placesCount, availablePlaces: places.length });
    if (placesError) {
      alert(placesError);
      return;
    }

    try {
      const studentsToGenerate = course.students.filter(s => selectedStudents.has(s.id));
      const impro = await deps.improGenerationUseCase.generate({ students: studentsToGenerate, placesCount });
      onImproGenerated(impro);
    } catch (error) {
      alert(`${messages.ERRORS.GENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de régénération de lieu
 * @param {{ places: Array, index: number, deps: Object, onUpdate: function(): void, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createPlaceRegenerateHandler({ places, index, deps, onUpdate, messages }) {
  return async () => {
    try {
      const newPlace = await deps.regenerationUseCase.regeneratePlace({ currentPlaces: places, placeIndex: index });
      places[index] = newPlace;
      onUpdate();
    } catch (error) {
      alert(`${messages.ERRORS.REGENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de suppression de lieu
 * @param {{ places: Array, index: number, deps: Object, onUpdate: function(): void, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createPlaceDeleteHandler({ places, index, deps, onUpdate, messages }) {
  return async () => {
    const placeName = places[index].name;
    const confirmed = await deps.deletionUseCase.confirmDeletion({
      confirmationMessage: messages.CONFIRMATIONS.DELETE_PLACE(placeName)
    });
    
    if (confirmed) {
      places.splice(index, 1);
      onUpdate();
    }
  };
}

/**
 * Crée un gestionnaire de régénération de personnage
 * @param {{ assignments: Array, index: number, deps: Object, onUpdate: function(): void, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createCharacterRegenerateHandler({ assignments, index, deps, onUpdate, messages }) {
  return async () => {
    try {
      const newCharacter = await deps.regenerationUseCase.regenerateCharacter({ currentAssignments: assignments, assignmentIndex: index });
      assignments[index].character = newCharacter;
      onUpdate();
    } catch (error) {
      alert(`${messages.ERRORS.REGENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de régénération d'émotion
 * @param {{ assignments: Array, index: number, deps: Object, onUpdate: function(): void, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createMoodRegenerateHandler({ assignments, index, deps, onUpdate, messages }) {
  return async () => {
    try {
      const newMood = await deps.regenerationUseCase.regenerateMood({ currentAssignments: assignments, assignmentIndex: index });
      assignments[index].mood = newMood;
      onUpdate();
    } catch (error) {
      alert(`${messages.ERRORS.REGENERATION_FAILED}: ${error.message}`);
    }
  };
}

/**
 * Crée un gestionnaire de suppression d'élève de l'impro
 * @param {{ assignments: Array, index: number, deps: Object, onUpdate: function(): void, messages: Object }} params
 * @returns {function(): Promise<void>}
 */
export function createStudentDeleteHandler({ assignments, index, deps, onUpdate, messages }) {
  return async () => {
    const studentName = assignments[index].student.name;
    const confirmed = await deps.deletionUseCase.confirmDeletion({
      confirmationMessage: messages.CONFIRMATIONS.DELETE_STUDENT(studentName)
    });
    
    if (confirmed) {
      assignments.splice(index, 1);
      onUpdate();
    }
  };
}