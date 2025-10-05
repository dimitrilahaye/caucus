// @ts-check
import '../../core/entities/mood.js';

/** @typedef {import('../../core/entities/mood.js').Mood} Mood */

const STORAGE_KEY = 'cre-impro~moods';

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
 * @param {Mood[]} moods
 */
function writeAll(moods) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
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
 * @returns {import('../../core/ports/moodsPort.js').MoodsPort}
 */
export function createMoodsAdapter() {
  return {
    async list() {
      return readAll();
    },
    async create(name) {
      const moods = readAll();
      const mood = { id: uuid(), name };
      writeAll([mood, ...moods]);
      return mood;
    },
    async rename(id, name) {
      const moods = readAll();
      const idx = moods.findIndex(m => m.id === id);
      if (idx === -1) return null;
      moods[idx] = { ...moods[idx], name };
      writeAll(moods);
      return moods[idx];
    },
    async remove(id) {
      const moods = readAll();
      const before = moods.length;
      const filtered = moods.filter(m => m.id !== id);
      writeAll(filtered);
      return filtered.length !== before;
    },
  };
}


