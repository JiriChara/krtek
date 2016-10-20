/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
});

test('triggers an action synchronously', (t) => {
  t.plan(1);

  let counter = 0;

  t.context.krtekInstance.on('foo', () => {
    ++counter;
  });

  t.context.krtekInstance.triggerSync('foo');

  t.is(counter, 1);
});

test.cb('triggers an action asynchronously', (t) => {
  t.plan(1);

  let counter = 0;

  t.context.krtekInstance.on('foo', () => {
    ++counter;
    t.end();
  });

  t.context.krtekInstance.trigger('foo');

  t.is(counter, 0);
});

test('passes arguments to handler', (t) => {
  t.plan(3);

  t.context.krtekInstance.on('foo', (a, b, c) => {
    t.is(a, 1);
    t.is(b, 2);
    t.is(c, 3);
  });

  t.context.krtekInstance.triggerSync('foo', 1, 2, 3);
});
