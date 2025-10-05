// @ts-check

/**
 * Fonctions de logique pour la page d'impro
 */

/**
 * Valide la sélection des élèves
 * @param {Set<string>} selectedStudents
 * @param {import('../../core/entities/course.js').Course} course
 * @returns {string|null} Message d'erreur ou null si valide
 */
export function validateStudentSelection(selectedStudents, course) {
  if (selectedStudents.size === 0) {
    return 'Sélectionnez au moins un élève';
  }
  
  if (selectedStudents.size > course.students.length) {
    return 'Trop d\'élèves sélectionnés';
  }
  
  return null;
}

/**
 * Valide le nombre de lieux demandé
 * @param {number} placesCount
 * @param {number} availablePlaces
 * @returns {string|null} Message d'erreur ou null si valide
 */
export function validatePlacesCount(placesCount, availablePlaces) {
  if (placesCount < 1) {
    return 'Au moins un lieu est requis';
  }
  
  if (placesCount > availablePlaces) {
    return `Maximum ${availablePlaces} lieu${availablePlaces > 1 ? 'x' : ''} disponible${availablePlaces > 1 ? 's' : ''}`;
  }
  
  return null;
}

/**
 * Gère la régénération d'un élément
 * @param {'place'|'character'|'mood'} type
 * @param {Array} currentItems
 * @param {number} index
 * @param {Object} deps
 * @returns {Promise<any>} Nouvel élément
 */
export async function handleRegeneration(type, currentItems, index, deps) {
  switch (type) {
    case 'place':
      return await regeneratePlace(currentItems, index, deps);
    case 'character':
      return await regenerateCharacter(currentItems, index, deps);
    case 'mood':
      return await regenerateMood(currentItems, index, deps);
    default:
      throw new Error(`Type de régénération non supporté: ${type}`);
  }
}

/**
 * Régénère un lieu
 * @param {Array} currentPlaces
 * @param {number} placeIndex
 * @param {Object} deps
 * @returns {Promise<any>}
 */
async function regeneratePlace(currentPlaces, placeIndex, deps) {
  const places = await deps.placesUseCase.list();
  
  // Exclure les lieux déjà utilisés ET le lieu actuel
  const usedPlaceIds = currentPlaces.map(p => p.id);
  const currentPlaceId = currentPlaces[placeIndex].id;
  const availablePlaces = places.filter(p => !usedPlaceIds.includes(p.id) && p.id !== currentPlaceId);
  
  if (availablePlaces.length === 0) {
    throw new Error('Aucun autre lieu disponible');
  }
  
  // Sélectionner aléatoirement un nouveau lieu
  const randomIndex = Math.floor(Math.random() * availablePlaces.length);
  return availablePlaces[randomIndex];
}

/**
 * Régénère un personnage
 * @param {Array} currentAssignments
 * @param {number} assignmentIndex
 * @param {Object} deps
 * @returns {Promise<any>}
 */
async function regenerateCharacter(currentAssignments, assignmentIndex, deps) {
  const characters = await deps.charactersUseCase.list();
  
  // Exclure les personnages déjà utilisés ET le personnage actuel
  const usedCharacterIds = currentAssignments.map(a => a.character.id);
  const currentCharacterId = currentAssignments[assignmentIndex].character.id;
  const availableCharacters = characters.filter(c => !usedCharacterIds.includes(c.id) && c.id !== currentCharacterId);
  
  if (availableCharacters.length === 0) {
    throw new Error('Aucun autre personnage disponible');
  }
  
  // Sélectionner aléatoirement un nouveau personnage
  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  return availableCharacters[randomIndex];
}

/**
 * Régénère une émotion
 * @param {Array} currentAssignments
 * @param {number} assignmentIndex
 * @param {Object} deps
 * @returns {Promise<any>}
 */
async function regenerateMood(currentAssignments, assignmentIndex, deps) {
  const moods = await deps.moodsUseCase.list();
  
  if (moods.length === 0) {
    throw new Error('Aucune émotion disponible');
  }
  
  // Exclure l'émotion actuelle
  const currentMoodId = currentAssignments[assignmentIndex].mood.id;
  const availableMoods = moods.filter(m => m.id !== currentMoodId);
  
  if (availableMoods.length === 0) {
    throw new Error('Aucune autre émotion disponible');
  }
  
  // Sélectionner aléatoirement une nouvelle émotion
  const randomIndex = Math.floor(Math.random() * availableMoods.length);
  return availableMoods[randomIndex];
}

/**
 * Gère la suppression d'un élément avec confirmation
 * @param {string} type
 * @param {Array} items
 * @param {number} index
 * @param {string} confirmationMessage
 * @param {function(): void} onConfirm
 * @returns {Promise<boolean>} True si supprimé, false si annulé
 */
export async function handleDeletion(type, items, index, confirmationMessage, onConfirm) {
  const confirmed = window.confirm(confirmationMessage);
  if (!confirmed) {
    return false;
  }
  
  onConfirm();
  return true;
}
