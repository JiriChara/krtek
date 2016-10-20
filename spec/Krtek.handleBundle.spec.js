/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.code = 'import Krtek from \'../src/Krtek\'';
});

test('returns browserified code', async (t) => {
  t.plan(3);

  const res = await t.context.krtekInstance.handleBundle(t.context.code);

  t.regex(res, /setJsCode/);
  t.regex(res, /getJsCode/);
  t.regex(res, /handleBundle/);
});

test.cb('returns error if bundling fails', (t) => {
  t.plan(1);

  t.context.krtekInstance.handleBundle('invalid js code')
    .catch((err) => {
      t.regex(
        err.message,
        /Unexpected token/
      );
      t.end();
    });
});

test('returns given string if no bundler', async (t) => {
  t.plan(1);

  t.context.krtekInstance.bundler = null;

  const res = await t.context.krtekInstance.handleBundle(t.context.code);

  t.is(res, t.context.code);
});
