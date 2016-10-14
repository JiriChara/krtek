import { Hooks } from 'hookies';
import express from 'express';
import browserify from 'browserify-string';
import babelify from 'babelify';
import path from 'path';
import fs from 'fs';

export default class Krtek extends Hooks {
  constructor({
    cache = true,
    minify = true,
    cacheFolder = '/tmp',
    contentType = 'text/plain',
    origin = 'localhost',
    host = process.env.HOST || 'localhost',
    port = process.env.PORT || 3000
  } = {}) {
    super();

    this.app = express();
    this.browserify = browserify;
    this.host = host;
    this.port = port;
    this.cacheFolder = cacheFolder;
    this.contentType = contentType;
    this.origin = origin;
    this.cache = cache;
    this.minify = minify;
  }

  configureMiddleware() {
    this.triggerSync('configure-middleware', this);

    this.app.use(express.static(
      path.resolve(__dirname, '..', 'public')
    ));
  }

  configureEndpoints() {
    this.triggerSync('configure-endpoints', this);

    this.app.get('/bundle', (req, res) => {
      this.triggerSync('route-bundle', this, req, res);

      this.bundle(req, res);
    });

    this.app.get('*', (req, res) => {
      this.triggerSync('route-root', this, req, res);

      res.sendFile(path.resolve(__dirname, '..', 'index.html'));
    });
  }

  configureJs(req, res) {
    this.triggerSync('configure-js', this, req, res);
  }

  bundle(req, res) {
    this.triggerSync('bundle', this, req, res);

    this.configureJs(req, res);

    const file = path.resolve(
      this.cacheFolder,
      `krtek-${this.generateHash(this.jsCode)}.cache`
    );

    const bundleFs = fs.createWriteStream(file);

    browserify(this.jsCode)
      .transform('babelify', {
        presets: ['es2015', 'react']
      })
      .bundle().pipe(bundleFs);

    bundleFs.on('finish', () => {
      fs.readFile(file, 'utf-8', (err, data) => {
        res.writeHead(200, {
          'Content-Type': this.contentType,
          'Access-Control-Allow-Origin': this.origin,
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        this.triggerSync('bundle-complete', this, req, res, err, data);
      });
    });
  }

  triggerSync(name, ...args) {
    return this.trigger({
      name,
      sync: true,
      context: this
    }, ...args);
  }

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

  start() {
    this.triggerSync('start', this);

    this.configureMiddleware();
    this.configureEndpoints();

    this.app.listen(this.port, this.host, () => {
      this.triggerSync('started', this);
    });
  }
}
