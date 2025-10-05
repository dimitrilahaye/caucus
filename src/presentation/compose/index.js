// @ts-check
import { createCoursesAdapter } from '../../datasource/localstorage/coursesAdapter.js';

/**
 * Composition root: instantiates adapters (datasource) and injects them into core use-cases.
 * For now this is a minimal placeholder to be expanded as features are implemented.
 */

/** @typedef {{
 *  coursesPort: import('../../core/ports/coursesPort.js').CoursesPort,
 * }} CompositionDeps */

/**
 * Initialize application composition and expose injected ports and use-cases.
 * @returns {CompositionDeps}
 */
export function composeApp() {
  const deps = {
    coursesPort: createCoursesAdapter(),
  };
  return deps;
}

