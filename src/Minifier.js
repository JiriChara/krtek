import uglify from 'uglify-js';

export default class Minifier {
  constructor(options = { fromString: true }) {
    this.options = options;
  }

  minify(jsString, callback) {
    try {
      callback(
        null,
        uglify.minify(
          jsString,
          this.options
        ).code
      );
    } catch (e) {
      callback(e.message);
    }
  }
}
