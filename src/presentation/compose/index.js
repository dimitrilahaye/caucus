// @ts-check
import { createCoursesAdapter } from '../../datasource/localstorage/coursesAdapter.js';
import { createPlacesAdapter } from '../../datasource/localstorage/placesAdapter.js';
import { createMoodsAdapter } from '../../datasource/localstorage/moodsAdapter.js';
import { createCharactersAdapter } from '../../datasource/localstorage/charactersAdapter.js';
import { createRandomAdapter } from '../../datasource/random/randomAdapter.js';
import { createCoursesUseCase } from '../../core/usecases/coursesUseCase.js';
import { createPlacesUseCase } from '../../core/usecases/placesUseCase.js';
import { createMoodsUseCase } from '../../core/usecases/moodsUseCase.js';
import { createCharactersUseCase } from '../../core/usecases/charactersUseCase.js';
import { createImproGenerationUseCase } from '../../core/usecases/generateImpro.js';
import { createValidationUseCase } from '../../core/usecases/validationUseCase.js';
import { createRegenerationUseCase } from '../../core/usecases/regenerationUseCase.js';
import { createDeletionUseCase } from '../../core/usecases/deletionUseCase.js';

/**
 * Composition root: instantiates adapters (datasource) and injects them into core use-cases.
 * For now this is a minimal placeholder to be expanded as features are implemented.
 */

/** @typedef {{
 *  coursesUseCase: import('../../core/usecases/coursesUseCase.js').CoursesUseCase,
 *  placesUseCase: import('../../core/usecases/placesUseCase.js').PlacesUseCase,
 *  moodsUseCase: import('../../core/usecases/moodsUseCase.js').MoodsUseCase,
 *  charactersUseCase: import('../../core/usecases/charactersUseCase.js').CharactersUseCase,
 *  improGenerationUseCase: import('../../core/usecases/generateImpro.js').ImproGenerationUseCase,
 *  validationUseCase: import('../../core/usecases/validationUseCase.js').ValidationUseCase,
 *  regenerationUseCase: import('../../core/usecases/regenerationUseCase.js').RegenerationUseCase,
 *  deletionUseCase: import('../../core/usecases/deletionUseCase.js').DeletionUseCase,
 * }} CompositionDeps */

/**
 * Initialize application composition and expose injected use-cases.
 * @returns {CompositionDeps}
 */
export function composeApp() {
  const randomPort = createRandomAdapter();
  
  // Create adapters
  const coursesAdapter = createCoursesAdapter();
  const placesAdapter = createPlacesAdapter();
  const moodsAdapter = createMoodsAdapter();
  const charactersAdapter = createCharactersAdapter();
  
  // Create use cases with injected dependencies
  const deps = {
    coursesUseCase: createCoursesUseCase({ deps: { coursesPort: coursesAdapter } }),
    placesUseCase: createPlacesUseCase({ deps: { placesPort: placesAdapter } }),
    moodsUseCase: createMoodsUseCase({ deps: { moodsPort: moodsAdapter } }),
    charactersUseCase: createCharactersUseCase({ deps: { charactersPort: charactersAdapter } }),
    improGenerationUseCase: createImproGenerationUseCase({
      deps: {
        charactersPort: charactersAdapter,
        moodsPort: moodsAdapter,
        placesPort: placesAdapter,
        randomPort
      }
    }),
    validationUseCase: createValidationUseCase(),
    regenerationUseCase: createRegenerationUseCase({
      deps: {
        placesPort: placesAdapter,
        charactersPort: charactersAdapter,
        moodsPort: moodsAdapter,
        randomPort
      }
    }),
    deletionUseCase: createDeletionUseCase(),
  };
  return deps;
}

