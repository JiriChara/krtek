/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';

import Cache from '../src/Cache';
import FileProvider from '../src/cache/FileProvider';

test.beforeEach((t) => {
  t.context.string = 'Some string';
  t.context.cache = new Cache({
    string: t.context.string
  });
});

test('initializes provider', (t) => {
  t.true(
    t.context.cache.provider instanceof FileProvider
  );
});

test('initializes provider to given one', (t) => {
  const provider = sinon.spy();
  const cache = new Cache({
    provider,
    string: t.context.string
  });

  t.is(
    cache.provider,
    provider
  );
});

test('throws an error if string was not given', (t) => {
  t.throws(() => new Cache(), /Please specify a string that you want to cache./);
});

test('initializes string to given one', (t) => {
  const string = 'Some string';

  const cache = new Cache({
    string
  });

  t.is(
    cache.string,
    string
  );
});

test('initializes krtekOptions', (t) => {
  t.deepEqual(
    t.context.cache.krtekOptions,
    {}
  );
});

test('initializes krtekOptions to given one', (t) => {
  const krtekOptions = sinon.spy();

  const cache = new Cache({
    string: t.context.string,
    krtekOptions
  });

  t.is(
    cache.krtekOptions,
    krtekOptions
  );
});

test('creates a cacheString', (t) => {
  t.is(
    t.context.cache.cacheString,
    '{}Somestring'
  );
});

test('creates a cacheString based on params', (t) => {
  const cache = new Cache({
    string: 'foo',
    krtekOptions: {
      foo: 1
    }
  });

  t.is(
    cache.cacheString,
    '{"foo":1}foo'
  );
});

test('generates cacheHash', (t) => {
  t.is(
    t.context.cache.cacheHash,
    t.context.cache.generateHash(
      t.context.cache.cacheString
    )
  );
});

test('generates numeric cacheHash', (t) => {
  t.regex(
    t.context.cache.cacheHash,
    /^-?\d+$/
  );
});

test('generates unique cacheHash', (t) => {
  const cache = new Cache({
    string: 'foo',
    krtekOptions: {
      foo: 1
    }
  });

  t.regex(
    cache.cacheHash,
    /^-?\d+$/
  );
  t.not(cache.cacheHash, t.context.cache.cacheHash);
});
