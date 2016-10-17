/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Minifier from '../src/Minifier';

test.beforeEach((t) => {
  t.context.minifierInstance = new Minifier();
  t.context.jsString = 'var foo = 1 + 1;';
});

test.cb('minifies given JavaScript string', (t) => {
  t.pass(2);

  t.context.minifierInstance.minify(t.context.jsString, (err, result) => {
    t.not(err);
    t.is(
      result,
      'var foo=2;'
    );
    t.end();
  });
});

test.cb('returns en error if JavaScript string is not valid', (t) => {
  t.pass(1);

  const invalidCode = 'invalid javascript code; var function function.';

  t.context.minifierInstance.minify(invalidCode, (err) => {
    t.regex(
      err,
      /SyntaxError/
    );
    t.end();
  });
});
