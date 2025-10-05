// @ts-check
import '../../core/entities/place.js';

/** @typedef {import('../../core/entities/place.js').Place} Place */

const STORAGE_KEY = 'cre-impro~places';

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
 * @param {Place[]} places
 */
function writeAll(places) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
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
 * @returns {import('../../core/ports/placesPort.js').PlacesPort}
 */
export function createPlacesAdapter() {
  return {
    async list() {
      return readAll();
    },
    async create(name) {
      const places = readAll();
      const place = { id: uuid(), name };
      writeAll([place, ...places]);
      return place;
    },
    async rename(id, name) {
      const places = readAll();
      const idx = places.findIndex(p => p.id === id);
      if (idx === -1) return null;
      places[idx] = { ...places[idx], name };
      writeAll(places);
      return places[idx];
    },
    async remove(id) {
      const places = readAll();
      const before = places.length;
      const filtered = places.filter(p => p.id !== id);
      writeAll(filtered);
      return filtered.length !== before;
    },
  };
}


