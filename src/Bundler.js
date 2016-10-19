import browserify from 'browserify-string';

export default class Bundler {
  constructor({
    babelOptions = {
      presets: ['es2015', 'react'],
    }
  } = {}) {
    this.babelOptions = babelOptions;
  }

  generateRandomHash() {
    return Math.random().toString(36).slice(2);
  }

  bundle(jsString) {
    return new Promise((resolve, reject) =>
      browserify(jsString)
        .transform('babelify', this.babelOptions)
        .bundle((err, src) => {
          if (err) return reject(err);
          return resolve(src.toString());
        })
    );
  }
}
