// @ts-check
import { createCoursesAdapter } from '../../datasource/localstorage/coursesAdapter.js';
import { createPlacesAdapter } from '../../datasource/localstorage/placesAdapter.js';
import { createMoodsAdapter } from '../../datasource/localstorage/moodsAdapter.js';

/**
 * Composition root: instantiates adapters (datasource) and injects them into core use-cases.
 * For now this is a minimal placeholder to be expanded as features are implemented.
 */

/** @typedef {{
 *  coursesPort: import('../../core/ports/coursesPort.js').CoursesPort,
 *  placesPort: import('../../core/ports/placesPort.js').PlacesPort,
 *  moodsPort: import('../../core/ports/moodsPort.js').MoodsPort,
 * }} CompositionDeps */

/**
 * Initialize application composition and expose injected ports and use-cases.
 * @returns {CompositionDeps}
 */
export function composeApp() {
  const deps = {
    coursesPort: createCoursesAdapter(),
    placesPort: createPlacesAdapter(),
    moodsPort: createMoodsAdapter(),
  };
  return deps;
}

