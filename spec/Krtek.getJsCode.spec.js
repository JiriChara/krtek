/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.jsCode = 'console.log(\'foo\');';
});

test('gets jsCode', (t) => {
  t.not(
    t.context.krtekInstance.getJsCode(),
    t.context.jsCode
  );

  t.context.krtekInstance.jsCode = t.context.jsCode;

  t.is(
    t.context.krtekInstance.getJsCode(),
    t.context.jsCode
  );
});
