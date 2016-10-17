/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';
import Cache from '../src/Cache';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.code = 'console.log(\'foo\');';
});

test('returns given code', async (t) => {
  t.plan(1);

  const res = await t.context.krtekInstance.handleCache(t.context.code);

  t.is(res, t.context.code);
});

test.cb('caches string', (t) => {
  t.plan(1);

  t.context.krtekInstance.handleCache(t.context.code).then(() => {
    const cache = new Cache({ string: t.context.code });

    cache.get().then((res) => {
      t.is(res, t.context.code);
      t.end();
    });
  });
});
