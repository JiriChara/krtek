import { FileProvider } from './cache';
import { CacheError } from './errors';

/**
 * Cache service is responsible for caching. It uses FileProvider as a cache provider by default.
 */
export default class Cache {
  constructor({
    provider = new FileProvider({
      folder: '/tmp'
    }),
    string
  } = {}) {
    /**
     * Caching provider. It must have set() and get() method.
     */
    this.provider = provider;

    /**
     * String that we would like to cache.
     */
    this.string = string;

    if (!this.string) {
      throw new CacheError(
        'Please specify a string that you want to cache.'
      );
    }

    /**
     * Cache hash used for cache invalidation.
     */
    this.cacheHash = this.generateHash(this.string);
  }

  /**
   * Set cache.
   */
  set() {
    try {
      return this.provider.set(
        this.cacheHash,
        this.string
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /*
   * Get cache.
   */
  get() {
    try {
      return this.provider.get(
        this.cacheHash
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /*
   * Generate a short hash based on string passed to it. It is used for cache invalidation.
   */
  generateHash(string) {
    let hash = 0;
    let i;
    let chr;
    let len;

    if (string === 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
      chr = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }
}
