/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Minifier from '../src/Minifier';

test.beforeEach((t) => {
  t.context.minifierInstance = new Minifier();
  t.context.jsString = 'var foo = 1 + 1;';
});

test('minifies given JavaScript string', async (t) => {
  t.plan(1);

  const res = await t.context.minifierInstance.minify(t.context.jsString);
  t.is(res, 'var foo=2;');
});

test.cb('returns en error if JavaScript string is not valid', (t) => {
  t.plan(1);

  const invalidCode = 'invalid javascript code; var function function.';

  t.context.minifierInstance.minify(invalidCode)
    .catch((err) => {
      t.regex(
        err.message,
        /SyntaxError/
      );
      t.end();
    });
});
