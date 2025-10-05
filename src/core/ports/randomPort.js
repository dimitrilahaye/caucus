// @ts-check

/**
 * @interface RandomPort
 * Interface for random number generation to inject into core use-cases.
 * Implement deterministically in tests and with Math.random in prod.
 */

/**
 * @typedef {object} RandomPort
 * @property {() => number} nextFloat returns a float in [0,1)
 */

export {}; // JSDoc-only interface file

