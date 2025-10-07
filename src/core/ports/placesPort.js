// @ts-check
import '../entities/place.js';

/**
 * @typedef {import('../entities/place.js').Place} Place
 */

/**
 * @typedef {object} PlacesPort
 * @property {() => Promise<Place[]>} list
 * @property {(params: {name: string}) => Promise<Place>} create
 * @property {(params: {id: string, newName: string}) => Promise<Place|undefined>} rename
 * @property {(params: {id: string}) => Promise<boolean>} remove
 */

export {};

