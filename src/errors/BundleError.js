export default function BundleError(message) {
  this.name = 'BundleError';
  this.message = message;
}

BundleError.prototype = Error.prototype;
