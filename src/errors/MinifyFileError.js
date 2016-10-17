export default function MinifyFileError(message) {
  this.name = 'MinifyFileError';
  this.message = message;
}

MinifyFileError.prototype = Error.prototype;
