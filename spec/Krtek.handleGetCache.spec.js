/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.originalCode = 'console.log(\'foo\'); //';
  t.context.cachedCode = 'console.log(\'foo\');';

  t.context.krtekInstance.handleSetCache(t.context.originalCode, t.context.cachedCode);
});

test('returns code from cached file', async (t) => {
  t.plan(1);

  const res = await t.context.krtekInstance.handleGetCache(
    t.context.originalCode
  );

  t.is(res, t.context.cachedCode);
});

test.cb('returns error if retrieving from cache fails', (t) => {
  t.plan(1);

  t.context.krtekInstance.handleGetCache('unknown')
    .catch((err) => {
      t.regex(err.message, /ENOENT/);
      t.end();
    });
});
