import uglify from 'uglify-js';

export default class Minifier {
  constructor(options = { fromString: true }) {
    this.options = options;
  }

  minify(jsString) {
    try {
      return Promise.resolve(
        uglify.minify(
          jsString,
          this.options
        ).code
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
