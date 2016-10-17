import { Hooks } from 'hookies';
import express from 'express';
import path from 'path';

import Minifier from './Minifier';
import Bundler from './Bundler';
import Cache from './Cache';
import FileProvider from './cache/FileProvider';

import {
  BundleError,
  CacheError,
  NoJSCodeGivenError,
  MinifyError
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

  handleCache(code) {
    const cacheProvider = this.createCacheProvider(code);

    return cacheProvider.set(code)
      .then(() => cacheProvider.get(code))
      .catch((err) => {
        throw new CacheError(err);
      });
  }

  handleBundle(code) {
    if (!this.bundler) return Promise.resolve(code);

    return this.bundler.bundle(code)
      .catch((err) => {
        throw new BundleError(err);
      });
  }

  handleMinify(code) {
    if (!this.minifier) return Promise.resolve(code);

    return this.minifier.minify(code)
      .catch((err) => {
        throw new MinifyError(err);
      });
  }

  bundle(req, res) {
    this.triggerSync('bundle', req, res);

    const code = this.getJsCode();
    let cacheProvider = null;

    if (!code) {
      throw new NoJSCodeGivenError(
        'Nothing to bundle - no JavaScript code given.'
      );
    }

    if (this.cacheOptions) {
      cacheProvider = this.createCacheProvider(code);

      return cacheProvider.get(code)
        .catch(() => this.handleBundle(code)
          .then(this.handleMinify)
          .then(this.handleCache)
        );
    }

    return this.handleBundle(code).then(this.handleMinify);
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
      this.triggerSync('start');
    });
  }
}
