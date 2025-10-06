// @ts-check
import '../entities/mood.js';

/** @typedef {import('../entities/mood.js').Mood} Mood */

/**
 * @typedef {object} MoodsPort
 * @property {() => Promise<Mood[]>} list
 * @property {(name: string) => Promise<Mood>} create
 * @property {(id: string, name: string) => Promise<Mood|undefined>} rename
 * @property {(id: string) => Promise<boolean>} remove
 */

export {};

