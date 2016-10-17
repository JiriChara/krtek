import fs from 'fs';
import path from 'path';
import browserify from 'browserify-string';

import readFile from './readFile';

export default class Bundler {
  constructor({
    babelOptions = {
      presets: ['es2015', 'react'],
    },
    folder = '/tmp'
  } = {}) {
    this.babelOptions = babelOptions;
    this.folder = folder;
  }

  generateRandomHash() {
    return Math.random().toString(36).slice(2);
  }

  bundle(jsString) {
    const file = path.resolve(
      this.folder,
      `krtek-${this.generateRandomHash()}.bundle`
    );

    const bundleFs = fs.createWriteStream(file);

    return new Promise((resolve, reject) => {
      browserify(jsString)
        .transform('babelify', this.babelOptions)
        .bundle()
        .pipe(bundleFs);

      bundleFs.on('finish', () => {
        bundleFs.end();
        return readFile(file).then(resolve, reject);
      });

      bundleFs.on('error', (err) => {
        bundleFs.end();
        return reject(err);
      });
    });
  }
}
