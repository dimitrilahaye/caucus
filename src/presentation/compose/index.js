// @ts-check

/**
 * Composition root: instantiates adapters (datasource) and injects them into core use-cases.
 * For now this is a minimal placeholder to be expanded as features are implemented.
 */

/** @typedef {{
 *  storagePort: unknown,
 *  randomPort: unknown,
 * }} CompositionDeps */

/**
 * Initialize application composition and expose injected ports and use-cases.
 * @returns {CompositionDeps}
 */
export function composeApp() {
  // Placeholder: later, create LocalStorage adapters implementing StoragePort
  // and an RNG adapter implementing RandomPort, then inject into use-cases.
  const deps = {
    storagePort: undefined,
    randomPort: undefined,
  };
  return deps;
}

