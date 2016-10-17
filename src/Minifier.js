import uglify from 'uglify-js';

export default class Minifier {
  constructor(options = { fromString: true }) {
    this.options = options;
  }

  minify(jsString) {
    return uglify.minify(
      jsString,
      this.options
    ).code;
  }
}
