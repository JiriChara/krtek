/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';
import Cache from '../src/Cache';
import FileProvider from '../src/cache/FileProvider';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.originalCode = 'console.log(\'foo\'); //';
  t.context.codeToCache = 'console.log(\'foo\');';
});

test('returns given code', async (t) => {
  t.plan(1);

  const res = await t.context.krtekInstance.handleSetCache(
    t.context.originalCode,
    t.context.codeToCache
  );

  t.is(res, t.context.codeToCache);
});

test.cb('caches string', (t) => {
  t.plan(1);

  t.context.krtekInstance.handleSetCache(
    t.context.originalCode,
    t.context.codeToCache
  ).then(() => {
    const cache = new Cache({ string: t.context.originalCode });

    cache.get().then((res) => {
      t.is(res, t.context.codeToCache);
      t.end();
    });
  });
});

test.cb('returns error if it fails', (t) => {
  t.plan(1);

  t.context.krtekInstance.cacheOptions = {
    provider: new FileProvider({
      folder: '/some/non/existing/folder'
    })
  };

  t.context.krtekInstance.handleSetCache(t.context.originalCode)
    .catch((err) => {
      t.regex(err.message, /ENOENT/);
      t.end();
    });
});
