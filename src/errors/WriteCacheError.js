export default function WriteCacheError(message) {
  this.name = 'WriteCacheError';
  this.message = message;
}

WriteCacheError.prototype = Error.prototype;
