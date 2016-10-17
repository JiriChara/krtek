import { FileProvider } from './cache';
import { CacheStringMissingError } from './errors';

/**
 * Cache service is responsible for caching. It uses FileProvider as a cache provider by default.
 */
export default class Cache {
  constructor({
    provider = new FileProvider({
      folder: '/tmp'
    }),
    string,
    krtekOptions = {}
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
      throw new CacheStringMissingError(
        'Please specify a string that you want to cache.'
      );
    }

    /**
     * Options that have been passed to krtek and that are relevant for generation of unique hash.
     */
    this.krtekOptions = krtekOptions;

    /**
     * Unique cache string that is generated based on string and options passed to krtek.
     */
    this.cacheString = `
      ${JSON.stringify(this.krtekOptions)}
      ${this.string}
    `;
    this.cacheString = this.cacheString.replace(/\s/g, '');

    /**
     * Cache hash used for cache invalidation.
     */
    this.cacheHash = this.generateHash(this.cacheString);
  }

  /**
   * Set cache.
   */
  set(callback) {
    return this.provider.set(
      this.cacheHash,
      this.string,
      callback
    );
  }

  /*
   * Get cache.
   */
  get(callback) {
    return this.provider.get(
      this.cacheHash,
      callback
    );
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
