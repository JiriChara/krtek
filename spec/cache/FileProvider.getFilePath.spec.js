/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import FileProvider from '../../src/cache/FileProvider';

test.beforeEach((t) => {
  t.context.fileProviderInstance = new FileProvider();
});

test('returns path to file in /tmp by default', (t) => {
  t.is(
    t.context.fileProviderInstance.getFilePath('foo'),
    '/tmp/krtek-foo.cache'
  );
});

test('returns path to file in given folder', (t) => {
  t.is(
    new FileProvider({ folder: '/opt' }).getFilePath('foo'),
    '/opt/krtek-foo.cache'
  );
});
