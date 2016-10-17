/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Bundler from '../src/Bundler';

test.beforeEach((t) => {
  t.context.bundlerInstance = new Bundler();
});

test.cb('returns bundled javascript', (t) => {
  t.pass(1);

  t.context.bundlerInstance.bundle(
    'console.log(\'foo\');'
  ).then((result) => {
    t.regex(result, /console\.log\('foo'\)/);
    t.end();
  });
});

test.cb('returns error if bundle fails', (t) => {
  t.pass(1);

  const bundler = new Bundler({
    folder: '/some/nonexisting/folder/'
  });

  bundler.bundle(
    'console.log(\'foo\');'
  ).catch((err) => {
    t.regex(
      err.message,
      /ENOENT: no such file or directory/
    );
    t.end();
  });
});
