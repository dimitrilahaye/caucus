// @ts-check
import '../entities/place.js';

/**
 * @typedef {import('../entities/place.js').Place} Place
 */

/**
 * @typedef {object} PlacesUseCase
 * @property {() => Promise<Place[]>} list
 * @property {(name: string) => Promise<Place>} create
 * @property {(id: string, newName: string) => Promise<Place | undefined>} rename
 * @property {(id: string) => Promise<boolean>} remove
 */

/**
 * Creates the places use case with injected dependencies.
 * @param {{ deps: { placesPort: import('../ports/placesPort.js').PlacesPort } }} params
 * @returns {PlacesUseCase}
 */
export function createPlacesUseCase({ deps }) {
  return {
    async list() {
      return await deps.placesPort.list();
    },

    async create(name) {
      return await deps.placesPort.create(name);
    },

    async rename(id, newName) {
      return await deps.placesPort.rename(id, newName);
    },

    async remove(id) {
      return await deps.placesPort.remove(id);
    }
  };
}
