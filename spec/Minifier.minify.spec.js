/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Minifier from '../src/Minifier';

test.beforeEach((t) => {
  t.context.minifierInstance = new Minifier();
  t.context.jsString = 'var foo = 1 + 1;';
});

test('minifies given JavaScript string', (t) => {
  t.is(
    t.context.minifierInstance.minify(t.context.jsString),
    'var foo=2;'
  );
});

test('throws an error if JavaScript string is not valid', (t) => {
  t.throws(() =>
    t.context.minifierInstance.minify('invalid javascript code; var function function.'),
    /SyntaxError/
  );
});
