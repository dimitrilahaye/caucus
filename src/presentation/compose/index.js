// @ts-check
import { createCoursesAdapter } from '../../datasource/localstorage/coursesAdapter.js';
import { createPlacesAdapter } from '../../datasource/localstorage/placesAdapter.js';
import { createMoodsAdapter } from '../../datasource/localstorage/moodsAdapter.js';
import { createCharactersAdapter } from '../../datasource/localstorage/charactersAdapter.js';
import { createRandomAdapter } from '../../datasource/random/randomAdapter.js';
import { createImproGenerationUseCase } from '../../core/usecases/generateImpro.js';

/**
 * Composition root: instantiates adapters (datasource) and injects them into core use-cases.
 * For now this is a minimal placeholder to be expanded as features are implemented.
 */

/** @typedef {{
 *  coursesPort: import('../../core/ports/coursesPort.js').CoursesPort,
 *  placesPort: import('../../core/ports/placesPort.js').PlacesPort,
 *  moodsPort: import('../../core/ports/moodsPort.js').MoodsPort,
 *  charactersPort: import('../../core/ports/charactersPort.js').CharactersPort,
 *  improGenerationUseCase: import('../../core/usecases/generateImpro.js').ImproGenerationUseCase,
 * }} CompositionDeps */

/**
 * Initialize application composition and expose injected ports and use-cases.
 * @returns {CompositionDeps}
 */
export function composeApp() {
  const randomPort = createRandomAdapter();
  const deps = {
    coursesPort: createCoursesAdapter(),
    placesPort: createPlacesAdapter(),
    moodsPort: createMoodsAdapter(),
    charactersPort: createCharactersAdapter(),
    improGenerationUseCase: createImproGenerationUseCase({
      charactersPort: createCharactersAdapter(),
      moodsPort: createMoodsAdapter(),
      placesPort: createPlacesAdapter(),
      randomPort
    }),
  };
  return deps;
}

