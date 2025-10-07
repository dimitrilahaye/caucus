// @ts-check
import '../entities/character.js';

/** @typedef {import('../entities/character.js').Character} Character */

/**
 * @typedef {object} CharactersPort
 * @property {() => Promise<Character[]>} list
 * @property {(params: {name: string}) => Promise<Character>} create
 * @property {(params: {id: string, newName: string}) => Promise<Character|undefined>} rename
 * @property {(params: {id: string}) => Promise<boolean>} remove
 */

export {};

