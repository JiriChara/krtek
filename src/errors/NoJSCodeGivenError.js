export default function NoJSCodeGivernError(message) {
  this.name = 'NoJSCodeGivernError';
  this.message = message;
}

NoJSCodeGivernError.prototype = Error.prototype;
