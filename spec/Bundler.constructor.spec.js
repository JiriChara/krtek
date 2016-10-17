/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Bundler from '../src/Bundler';

test.beforeEach((t) => {
  t.context.bundlerInstance = new Bundler();
});

test('initializes babelOptions', (t) => {
  t.deepEqual(
    t.context.bundlerInstance.babelOptions,
    {
      presets: ['es2015', 'react'],
    }
  );
});

test('initializes babelOptions to given one', (t) => {
  const bundler = new Bundler({
    babelOptions: {
      foo: 1,
      bar: 2
    }
  });

  t.deepEqual(
    bundler.babelOptions,
    {
      foo: 1,
      bar: 2
    }
  );
});

test('initializes folder', (t) => {
  t.is(
    t.context.bundlerInstance.folder,
    '/tmp'
  );
});

test('initializes folder to given one', (t) => {
  const bundler = new Bundler({
    folder: '/opt'
  });

  t.deepEqual(
    bundler.folder,
    '/opt'
  );
});
