export default function ReadCacheError(message) {
  this.name = 'ReadCacheError';
  this.message = message;
}

ReadCacheError.prototype = Error.prototype;
