/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Bundler from '../src/Bundler';

test.beforeEach((t) => {
  t.context.bundlerInstance = new Bundler();
});

test('generates random hash', (t) => {
  t.not(
    t.context.bundlerInstance.generateRandomHash(),
    t.context.bundlerInstance.generateRandomHash()
  );
});

test('generates string with a-z 0-9 only', (t) => {
  t.regex(
    t.context.bundlerInstance.generateRandomHash(),
    /^[a-z0-9]+$/
  );
});
