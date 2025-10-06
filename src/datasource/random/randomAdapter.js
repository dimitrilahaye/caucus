// @ts-check

/**
 * Simple random number generator using Math.random
 * @returns {import('../core/ports/randomPort.js').RandomPort}
 */
export function createRandomAdapter() {
  return {
    nextFloat() {
      return Math.random();
    }
  };
}
