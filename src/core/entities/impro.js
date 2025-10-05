// @ts-check
import './course.js';
import './character.js';
import './mood.js';
import './place.js';

/**
 * @typedef {import('./course.js').Student} Student
 * @typedef {import('./character.js').Character} Character
 * @typedef {import('./mood.js').Mood} Mood
 * @typedef {import('./place.js').Place} Place
 */

/**
 * @typedef {object} ImproAssignment
 * @property {Student} student
 * @property {Character} character
 * @property {Mood} mood
 */

/**
 * @typedef {object} Impro
 * @property {ImproAssignment[]} assignments
 * @property {Place[]} places
 */

export {}; // JSDoc-only typedefs
