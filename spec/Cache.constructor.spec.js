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

test('generates cacheHash', (t) => {
  t.is(
    t.context.cache.cacheHash,
    t.context.cache.generateHash(
      t.context.cache.string
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
    string: 'foo'
  });

  t.regex(
    cache.cacheHash,
    /^-?\d+$/
  );
  t.not(cache.cacheHash, t.context.cache.cacheHash);
});
