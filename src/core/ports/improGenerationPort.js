// @ts-check
import '../entities/impro.js';

/**
 * @typedef {import('../entities/impro.js').Impro} Impro
 * @typedef {import('../entities/course.js').Student} Student
 */

/**
 * @typedef {object} ImproGenerationPort
 * @property {(students: Student[], placesCount: number) => Promise<Impro>} generate
 */
