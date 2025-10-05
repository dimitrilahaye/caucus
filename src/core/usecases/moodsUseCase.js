// @ts-check
import '../entities/mood.js';

/**
 * @typedef {import('../entities/mood.js').Mood} Mood
 */

/**
 * @typedef {object} MoodsUseCase
 * @property {() => Promise<Mood[]>} list
 * @property {(name: string) => Promise<Mood>} create
 * @property {(id: string, newName: string) => Promise<Mood | undefined>} rename
 * @property {(id: string) => Promise<boolean>} remove
 */

/**
 * Creates the moods use case with injected dependencies.
 * @param {{
 *   moodsPort: import('../ports/moodsPort.js').MoodsPort
 * }} deps
 * @returns {MoodsUseCase}
 */
export function createMoodsUseCase(deps) {
  return {
    async list() {
      return await deps.moodsPort.list();
    },

    async create(name) {
      return await deps.moodsPort.create(name);
    },

    async rename(id, newName) {
      return await deps.moodsPort.rename(id, newName);
    },

    async remove(id) {
      return await deps.moodsPort.remove(id);
    }
  };
}
