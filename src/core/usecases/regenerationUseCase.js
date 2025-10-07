// @ts-check

/**
 * Use-case pour la régénération d'éléments d'impro
 */

/**
 * @typedef {object} RegenerationUseCase
 * @property {(params: {currentPlaces: Array, placeIndex: number}) => Promise<any>} regeneratePlace
 * @property {(params: {currentAssignments: Array, assignmentIndex: number}) => Promise<any>} regenerateCharacter
 * @property {(params: {currentAssignments: Array, assignmentIndex: number}) => Promise<any>} regenerateMood
 */

/**
 * Crée le use-case de régénération
 * @param {{ deps: { placesPort: import('../ports/placesPort.js').PlacesPort, charactersPort: import('../ports/charactersPort.js').CharactersPort, moodsPort: import('../ports/moodsPort.js').MoodsPort, randomPort: import('../ports/randomPort.js').RandomPort } }} params
 * @returns {RegenerationUseCase}
 */
export function createRegenerationUseCase({ deps }) {
  return {
    async regeneratePlace({ currentPlaces, placeIndex }) {
      const places = await deps.placesPort.list();
      
      // Exclure les lieux déjà utilisés ET le lieu actuel
      const usedPlaceIds = currentPlaces.map(p => p.id);
      const currentPlaceId = currentPlaces[placeIndex].id;
      const availablePlaces = places.filter(p => !usedPlaceIds.includes(p.id) && p.id !== currentPlaceId);
      
      if (availablePlaces.length === 0) {
        throw new Error('Aucun autre lieu disponible');
      }
      
      // Sélectionner aléatoirement un nouveau lieu
      const randomIndex = Math.floor(deps.randomPort.nextFloat() * availablePlaces.length);
      return availablePlaces[randomIndex];
    },

    async regenerateCharacter({ currentAssignments, assignmentIndex }) {
      const characters = await deps.charactersPort.list();
      
      // Exclure les personnages déjà utilisés ET le personnage actuel
      const usedCharacterIds = currentAssignments.map(a => a.character.id);
      const currentCharacterId = currentAssignments[assignmentIndex].character.id;
      const availableCharacters = characters.filter(c => !usedCharacterIds.includes(c.id) && c.id !== currentCharacterId);
      
      if (availableCharacters.length === 0) {
        throw new Error('Aucun autre personnage disponible');
      }
      
      // Sélectionner aléatoirement un nouveau personnage
      const randomIndex = Math.floor(deps.randomPort.nextFloat() * availableCharacters.length);
      return availableCharacters[randomIndex];
    },

    async regenerateMood({ currentAssignments, assignmentIndex }) {
      const moods = await deps.moodsPort.list();
      
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
      const randomIndex = Math.floor(deps.randomPort.nextFloat() * availableMoods.length);
      return availableMoods[randomIndex];
    }
  };
}
