/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';

import Krtek from '../src/Krtek';
import Cache from '../src/Cache';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.string = 'foo';
});

test('returns new instance of Cache', (t) => {
  t.true(
    t.context.krtekInstance.createCacheProvider(
      t.context.string
    ) instanceof Cache
  );
});

test('passes cacheOptions', (t) => {
  const provider = sinon.spy();

  t.context.krtekInstance.cacheOptions = {
    provider
  };

  t.is(
    t.context.krtekInstance.createCacheProvider(
      t.context.string
    ).provider,
    provider
  );
});
