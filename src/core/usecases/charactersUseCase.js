// @ts-check
import '../entities/character.js';

/**
 * @typedef {import('../entities/character.js').Character} Character
 */

/**
 * @typedef {object} CharactersUseCase
 * @property {() => Promise<Character[]>} list
 * @property {(name: string) => Promise<Character>} create
 * @property {(id: string, newName: string) => Promise<Character | undefined>} rename
 * @property {(id: string) => Promise<boolean>} remove
 */

/**
 * Creates the characters use case with injected dependencies.
 * @param {{ deps: { charactersPort: import('../ports/charactersPort.js').CharactersPort } }} params
 * @returns {CharactersUseCase}
 */
export function createCharactersUseCase({ deps }) {
  return {
    async list() {
      return await deps.charactersPort.list();
    },

    async create(name) {
      return await deps.charactersPort.create(name);
    },

    async rename(id, newName) {
      return await deps.charactersPort.rename(id, newName);
    },

    async remove(id) {
      return await deps.charactersPort.remove(id);
    }
  };
}
