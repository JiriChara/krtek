/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Minifier from '../src/Minifier';

test.beforeEach((t) => {
  t.context.minifierInstance = new Minifier();
});

test('initializes options object', (t) => {
  t.deepEqual(
    t.context.minifierInstance.options,
    {
      fromString: true
    }
  );
});

test('initializes options object to given one', (t) => {
  const myOptions = {
    foo: 1,
    bar: 2
  };

  t.is(
    new Minifier(myOptions).options,
    myOptions
  );
});
