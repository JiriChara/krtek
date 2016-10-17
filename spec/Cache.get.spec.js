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

test.cb('retrieves file from cache', (t) => {
  t.pass(1);

  t.context.cache.set().then(() => {
    t.context.cache.get().then((string) => {
      t.is(string, t.context.string);
      t.end();
    });
  });
});

test.cb('returns an error if caching provider fails', (t) => {
  t.pass(1);

  const cache = new Cache({
    string: t.context.string,
    provider: new FileProvider({
      folder: '/non-existing/folder'
    })
  });

  cache.get().catch((err) => {
    t.regex(
      err.message,
      /ENOENT: no such file or directory/
    );
    t.end();
  });
});

test.cb('returns an error if retrieving fails', (t) => {
  t.pass(1);

  const cache = new Cache({
    string: t.context.string,
    provider: sinon.spy()
  });

  cache.get().catch((err) => {
    t.regex(
      err.message,
      /this\.provider\.get is not a function/
    );
    t.end();
  });
});
