// @ts-check

/**
 * Minimal hash-based router. Supports patterns like "#/courses" and "#/courses/:id".
 */

/**
 * @typedef {(params: Record<string,string>) => void} RouteHandler
 */

/**
 * @typedef {{
 *   pattern: RegExp,
 *   keys: string[],
 *   handler: RouteHandler
 * }} CompiledRoute
 */

/**
 * @param {string} path e.g. "/courses/:id"
 * @param {RouteHandler} handler
 * @returns {CompiledRoute}
 */
function compile(path, handler) {
  const keys = [];
  const regexStr = path
    .replace(/\//g, '\\/')
    .replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    });
  const pattern = new RegExp('^' + regexStr + '$');
  return { pattern, keys, handler };
}

export class Router {
  /** @type {CompiledRoute[]} */
  #routes = [];

  /**
   * @param {Array<{path: string, handler: RouteHandler}>} routes
   */
  constructor(routes) {
    this.#routes = routes.map(r => compile(r.path, r.handler));
  }

  start() {
    window.addEventListener('hashchange', () => this.#dispatch());
    if (!location.hash) {
      location.hash = '#/courses';
    } else {
      this.#dispatch();
    }
  }

  #dispatch() {
    const hash = location.hash.replace(/^#/, '');
    for (const r of this.#routes) {
      const m = hash.match(r.pattern);
      if (m) {
        const params = {};
        r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
        r.handler(params);
        return;
      }
    }
  }
}


