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

  bundle(jsString, callback) {
    const file = path.resolve(
      this.folder,
      `krtek-${this.generateRandomHash()}.bundle`
    );

    const bundleFs = fs.createWriteStream(file);

    browserify(jsString)
      .transform('babelify', this.babelOptions)
      .bundle()
      .pipe(bundleFs);

    bundleFs.on('finish', () => {
      bundleFs.end();
      readFile(file, callback);
    });

    bundleFs.on('error', (err) => {
      bundleFs.end();
      callback(err);
    });
  }
}
