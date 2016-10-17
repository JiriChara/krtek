export default function CacheStringMissingError(message) {
  this.name = 'CacheStringMissingError';
  this.message = message;
}

CacheStringMissingError.prototype = Error.prototype;
