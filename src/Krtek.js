import { Hooks } from 'hookies';
import express from 'express';
import path from 'path';

import Minifier from './Minifier';
import Bundler from './Bundler';
import Cache from './Cache';
import FileProvider from './cache/FileProvider';

import {
  NoJSCodeGivenError,
  CacheError
} from './errors';

export default class Krtek extends Hooks {
  constructor({
    app = express(),
    host = process.env.HOST || 'localhost',
    port = process.env.PORT || 3000,
    headers = {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': 'localhost',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    createIndexRoute = true,
    cacheOptions = {
      provider: new FileProvider()
    },
    minifier = new Minifier(),
    bundler = new Bundler()
  } = {}) {
    super();

    this.app = app;
    this.host = host;
    this.port = port;
    this.headers = headers;
    this.createIndexRoute = createIndexRoute;
    this.cacheOptions = cacheOptions;
    this.minifier = minifier;
    this.bundler = bundler;
  }

  setJsCode(string) {
    this.jsCode = string;
    return string;
  }

  getJsCode() {
    return this.jsCode;
  }

  configureMiddleware() {
    if (!this.createIndexRoute) return;

    this.app.get('/', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'index.html'));
    });

    this.app.use(express.static(
      path.resolve(__dirname, '..', 'public')
    ));
  }

  createCacheProvider(string) {
    return new Cache(
      Object.assign({}, this.cacheOptions, {
        string
      })
    );
  }

  handleSetCache(originalCode, code) {
    if (this.cacheOptions) {
      const cacheProvider = this.createCacheProvider(originalCode);

      return cacheProvider.set(code)
        .then(() => this.handleGetCache(originalCode));
    }

    return Promise.resolve(code);
  }

  handleGetCache(code) {
    if (this.cacheOptions) {
      const cacheProvider = this.createCacheProvider(code);

      return cacheProvider.get();
    }

    try {
      throw new CacheError(
        'Cannot retrieve object from cache. Cache options are not given.'
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }

  handleBundle(code) {
    if (!this.bundler) return Promise.resolve(code);

    return this.bundler.bundle(code);
  }

  handleMinify(code) {
    if (!this.minifier) return Promise.resolve(code);

    return this.minifier.minify(code);
  }

  handleDone(req, res, result) {
    this.trigger('done', req, res, result);
  }

  handleError(req, res, err) {
    this.trigger('error', req, res, err);
  }

  bundle(req, res) {
    this.triggerSync('bundle', req, res);

    const code = this.getJsCode();

    if (!code) {
      throw new NoJSCodeGivenError(
        'Nothing to bundle - no JavaScript code given.'
      );
    }

    const getCachePromise = this.handleGetCache(code);

    getCachePromise
      .then(cacheResult => this.handleDone(req, res, cacheResult))
      .catch(() => {
        const bundlePromise = this.handleBundle(code);
        const minifyPromise = bundlePromise.then(result => this.handleMinify(result));
        const setCachePromise = minifyPromise.then(result => this.handleSetCache(code, result));

        setCachePromise
          .then(result => this.handleDone(req, res, result))
          .catch(err => this.handleError(req, res, err));
      });
  }

  triggerSync(name, ...args) {
    return this.trigger({
      name,
      sync: true,
      context: this
    }, ...args);
  }

  start() {
    this.configureMiddleware();

    this.app.listen(this.port, this.host, () => {
      this.trigger('start');
    });
  }
}
