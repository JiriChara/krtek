export default function MinifyError(message) {
  this.name = 'MinifyError';
  this.message = message;
}

MinifyError.prototype = Error.prototype;
