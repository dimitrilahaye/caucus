// @ts-check
import '../entities/place.js';

/**
 * @typedef {import('../entities/place.js').Place} Place
 */

/**
 * @typedef {object} PlacesPort
 * @property {() => Promise<Place[]>} list
 * @property {(name: string) => Promise<Place>} create
 * @property {(id: string, name: string) => Promise<Place|undefined>} rename
 * @property {(id: string) => Promise<boolean>} remove
 */

export {};

