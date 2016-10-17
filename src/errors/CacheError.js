export default function CacheError(message) {
  this.name = 'CacheError';
  this.message = message;
}

CacheError.prototype = Error.prototype;
