import fs from 'fs';
import { Hooks } from 'hookies';
import express from 'express';
import browserify from 'browserify-string';
import path from 'path';
import uglify from 'minify';

export default class Krtek extends Hooks {
  constructor({
    cache = false,
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
    this.triggerSync('configure-middleware');

    this.app.use(express.static(
      path.resolve(__dirname, '..', 'public')
    ));

    this.triggerSync('configure-middleware-done');
  }

  configureEndpoints() {
    this.triggerSync('configure-endpoints');

    this.app.get('/bundle', (req, res) => {
      this.triggerSync('route-bundle', req, res);

      this.bundle(req, res);
    });

    this.app.get('*', (req, res) => {
      this.triggerSync('route-root', req, res);

      res.sendFile(path.resolve(__dirname, '..', 'index.html'));
    });

    this.triggerSync('configure-endpoints-done');
  }

  configureJs(req, res) {
    this.triggerSync('configure-js', req, res);

    res.writeHead(200, {
      'Content-Type': this.contentType,
      'Access-Control-Allow-Origin': this.origin,
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  }

  bundle(req, res) {
    this.triggerSync('bundle', req, res);

    this.configureJs(req, res);

    const file = path.resolve(
      this.cacheFolder,
      `krtek-${this.generateHash(this.jsCode)}.cache`
    );

    this.off('minify-done');
    this.on('minify-done', (...args) => {
      this.triggerSync('bundle-done', ...args);

      if (!this.cache) {
        this.removeTempFile(file);
      }
    });

    if (this.cache && fs.existsSync(file)) {
      this.readFile(file, req, res);
      return;
    }

    const bundleFs = fs.createWriteStream(file);

    browserify(this.jsCode)
      .transform('babelify', {
        presets: ['es2015', 'react']
      })
      .bundle().pipe(bundleFs);

    bundleFs.on('finish', () => {
      this.readFile(file, req, res);
    });
  }

  minifyFile(file, req, res) {
    this.triggerSync('minify');

    fs.readFile(file, 'utf-8', (err, data) => {
      const result = uglify.js(data);

      fs.writeFile(file, result, (writeErr) => {
        if (writeErr) {
          return this.triggerSync('minify-error', writeErr);
        }

        return this.triggerSync('minify-done', req, res, result);
      });
    });
  }

  readFile(file, req, res) {
    fs.readFile(file, 'utf-8', () => {
      this.minifyFile(file, req, res);
    });
  }

  removeTempFile(file) {
    this.triggerSync('remove-temp-file', file);

    fs.unlink(file, () => {
      this.triggerSync('remove-temp-file-done');
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
    this.triggerSync('start');

    this.configureMiddleware();
    this.configureEndpoints();

    this.app.listen(this.port, this.host, () => {
      this.triggerSync('started');
    });
  }
}
