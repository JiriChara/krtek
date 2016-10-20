/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.originalCode = 'console.log(\'foo\'); //';
  t.context.originalCode2 = 'console.log(\'foo\'); // bar';
  t.context.cachedCode = 'console.log(\'foo\');';
});

test.cb('returns code from cached file', (t) => {
  t.plan(1);

  t.context.krtekInstance.handleSetCache(t.context.originalCode, t.context.cachedCode).then(() => {
    t.context.krtekInstance.handleGetCache(t.context.originalCode)
      .then((res) => {
        t.is(res, t.context.cachedCode);
        t.end();
      });
  });
});

test.cb('returns error if retrieving from cache fails', (t) => {
  t.plan(1);

  t.context.krtekInstance.handleGetCache('unknown')
    .catch((err) => {
      t.regex(err.message, /ENOENT/);
      t.end();
    });
});

test.cb('rejects if cacheOptions are not present', (t) => {
  t.plan(1);

  t.context.krtekInstance.cacheOptions = null;
  t.context.krtekInstance.handleGetCache(t.context.originalCode2)
    .catch((err) => {
      t.regex(err.message, /Cannot retrieve object from cache. Cache options are not given./);
      t.end();
    });
});
