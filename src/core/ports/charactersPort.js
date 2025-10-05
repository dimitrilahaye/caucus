// @ts-check
import '../entities/character.js';

/** @typedef {import('../entities/character.js').Character} Character */

/**
 * @typedef {object} CharactersPort
 * @property {() => Promise<Character[]>} list
 * @property {(name: string) => Promise<Character>} create
 * @property {(id: string, name: string) => Promise<Character|undefined>} rename
 * @property {(id: string) => Promise<boolean>} remove
 */

export {};

