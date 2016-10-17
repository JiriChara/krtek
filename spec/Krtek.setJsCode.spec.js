/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.jsCode = 'console.log(\'foo\');';
});

test('sets jsCode', (t) => {
  t.not(
    t.context.krtekInstance.jsCode,
    t.context.jsCode
  );

  t.context.krtekInstance.setJsCode(
    t.context.jsCode
  );

  t.is(
    t.context.krtekInstance.jsCode,
    t.context.jsCode
  );
});

test('returns given code', (t) => {
  t.is(
    t.context.krtekInstance.setJsCode(
      t.context.jsCode
    ),
    t.context.jsCode
  );
});
