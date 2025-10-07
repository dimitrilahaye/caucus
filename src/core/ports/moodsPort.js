// @ts-check
import '../entities/mood.js';

/** @typedef {import('../entities/mood.js').Mood} Mood */

/**
 * @typedef {object} MoodsPort
 * @property {() => Promise<Mood[]>} list
 * @property {(params: {name: string}) => Promise<Mood>} create
 * @property {(params: {id: string, newName: string}) => Promise<Mood|undefined>} rename
 * @property {(params: {id: string}) => Promise<boolean>} remove
 */

export {};

