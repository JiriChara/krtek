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

test.cb('caches file', (t) => {
  t.plan(1);

  t.context.cache.set().then(() => {
    t.context.cache.get().then((string) => {
      t.is(string, t.context.string);
      t.end();
    });
  });
});

test.cb('returns an error if caching provider fails', (t) => {
  t.plan(1);

  const cache = new Cache({
    string: t.context.string,
    provider: new FileProvider({
      folder: '/non-existing/folder'
    })
  });

  cache.set().catch((err) => {
    t.regex(
      err.message,
      /ENOENT: no such file or directory/
    );
    t.end();
  });
});

test.cb('returns an error if caching fails', (t) => {
  t.plan(1);

  const cache = new Cache({
    string: t.context.string,
    provider: sinon.spy()
  });

  cache.set().catch((err) => {
    t.regex(
      err.message,
      /this\.provider\.set is not a function/
    );
    t.end();
  });
});
