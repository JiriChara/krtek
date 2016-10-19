/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Bundler from '../src/Bundler';

test.beforeEach((t) => {
  t.context.bundlerInstance = new Bundler();
});

test('returns bundled javascript', async (t) => {
  t.plan(1);

  const res = await t.context.bundlerInstance.bundle(
    'console.log(\'foo\');'
  );

  t.regex(res, /console\.log\('foo'\)/);
});

test.cb('returns error if bundle fails', (t) => {
  t.plan(1);

  const bundler = new Bundler();

  bundler.bundle(
    'invalid js code'
  ).catch((err) => {
    t.regex(
      err.message,
      /Unexpected token/
    );
    t.end();
  });
});
