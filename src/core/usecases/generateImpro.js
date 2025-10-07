// @ts-check
import '../entities/impro.js';
import '../entities/course.js';
import '../entities/character.js';
import '../entities/mood.js';
import '../entities/place.js';

/**
 * @typedef {import('../entities/impro.js').Impro} Impro
 * @typedef {import('../entities/impro.js').ImproAssignment} ImproAssignment
 * @typedef {import('../entities/course.js').Student} Student
 * @typedef {import('../entities/character.js').Character} Character
 * @typedef {import('../entities/mood.js').Mood} Mood
 * @typedef {import('../entities/place.js').Place} Place
 */

/**
 * @typedef {object} ImproGenerationUseCase
 * @property {(students: Student[], placesCount: number) => Promise<Impro>} generate
 */

/**
 * Creates the impro generation use case with injected dependencies.
 * @param {{ deps: { charactersPort: import('./charactersPort.js').CharactersPort, moodsPort: import('./moodsPort.js').MoodsPort, placesPort: import('./placesPort.js').PlacesPort, randomPort: import('./randomPort.js').RandomPort } }} params
 * @returns {ImproGenerationUseCase}
 */
export function createImproGenerationUseCase({ deps }) {
  return {
    async generate(students, placesCount) {
      if (!students.length) {
        throw new Error('Aucun élève sélectionné');
      }

      const [characters, moods, places] = await Promise.all([
        deps.charactersPort.list(),
        deps.moodsPort.list(),
        deps.placesPort.list()
      ]);

      if (characters.length < students.length) {
        throw new Error(`Pas assez de personnages (${characters.length}) pour ${students.length} élèves`);
      }

      if (!moods.length) {
        throw new Error('Aucune émotion disponible');
      }

      if (!places.length) {
        throw new Error('Aucun lieu disponible');
      }

      if (places.length < placesCount) {
        const missing = placesCount - places.length;
        throw new Error(`Il manque ${missing} lieu${missing > 1 ? 'x' : ''} pour satisfaire la demande (${places.length} disponible${places.length > 1 ? 's' : ''}, ${placesCount} demandé${placesCount > 1 ? 's' : ''})`);
      }

      // Shuffle arrays using Fisher-Yates
      const shuffledCharacters = [...characters];
      const shuffledMoods = [...moods];
      const shuffledPlaces = [...places];

      for (let i = shuffledCharacters.length - 1; i > 0; i--) {
        const j = Math.floor(deps.randomPort.nextFloat() * (i + 1));
        [shuffledCharacters[i], shuffledCharacters[j]] = [shuffledCharacters[j], shuffledCharacters[i]];
      }

      for (let i = shuffledMoods.length - 1; i > 0; i--) {
        const j = Math.floor(deps.randomPort.nextFloat() * (i + 1));
        [shuffledMoods[i], shuffledMoods[j]] = [shuffledMoods[j], shuffledMoods[i]];
      }

      for (let i = shuffledPlaces.length - 1; i > 0; i--) {
        const j = Math.floor(deps.randomPort.nextFloat() * (i + 1));
        [shuffledPlaces[i], shuffledPlaces[j]] = [shuffledPlaces[j], shuffledPlaces[i]];
      }

      // Assign characters (no duplicates) and moods (can duplicate)
      const assignments = students.map((student, index) => ({
        student,
        character: shuffledCharacters[index],
        mood: shuffledMoods[index % shuffledMoods.length]
      }));

      // Select places
      const selectedPlacesCount = Math.min(placesCount, shuffledPlaces.length);
      const selectedPlaces = shuffledPlaces.slice(0, selectedPlacesCount);

      return {
        assignments,
        places: selectedPlaces
      };
    }
  };
}
