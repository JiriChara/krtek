/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.code = 'var foo = 1 + 1;';
});

test('returns minified code', async (t) => {
  t.plan(1);

  const res = await t.context.krtekInstance.handleMinify(t.context.code);

  t.is(res, 'var foo=2;');
});

test.cb('returns error if minifying fails', (t) => {
  t.plan(1);

  t.context.krtekInstance.handleMinify('invalid js code')
    .catch((err) => {
      t.regex(
        err.message,
        /Unexpected token/
      );
      t.end();
    });
});

test('returns given string if no minifier', async (t) => {
  t.plan(1);

  t.context.krtekInstance.minifier = null;

  const res = await t.context.krtekInstance.handleMinify(t.context.code);

  t.is(res, t.context.code);
});
