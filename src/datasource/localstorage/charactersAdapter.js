// @ts-check
import '../../core/entities/character.js';

/** @typedef {import('../../core/entities/character.js').Character} Character */

const STORAGE_KEY = 'cre-impro~characters';

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @param {Character[]} characters
 */
function writeAll(characters) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

function uuid() {
  if (crypto && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @returns {import('../../core/ports/charactersPort.js').CharactersPort}
 */
export function createCharactersAdapter() {
  return {
    async list() {
      return readAll();
    },
    async create(name) {
      const characters = readAll();
      const character = { id: uuid(), name };
      writeAll([character, ...characters]);
      return character;
    },
    async rename(id, name) {
      const characters = readAll();
      const idx = characters.findIndex(c => c.id === id);
      if (idx === -1) return undefined;
      characters[idx] = { ...characters[idx], name };
      writeAll(characters);
      return characters[idx];
    },
    async remove(id) {
      const characters = readAll();
      const before = characters.length;
      const filtered = characters.filter(c => c.id !== id);
      writeAll(filtered);
      return filtered.length !== before;
    },
  };
}


