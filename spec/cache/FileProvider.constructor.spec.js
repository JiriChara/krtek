/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import FileProvider from '../../src/cache/FileProvider';

test.beforeEach((t) => {
  t.context.fileProviderInstance = new FileProvider();
});

test('initializes folder', (t) => {
  t.is(
    t.context.fileProviderInstance.folder,
    '/tmp'
  );
});

test('initializes folder to given one', (t) => {
  t.is(
    new FileProvider({
      folder: '/opt'
    }).folder,
    '/opt'
  );
});
