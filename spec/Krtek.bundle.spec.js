/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';

import Krtek from '../src/Krtek';
import Cache from '../src/Cache';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.jsCode = `
    console.log('foo');
    console.log('bar');
  `;
  t.context.jsCode2 = `
    console.log('foo');
    console.log(1 + 1);
  `;
  t.context.krtekInstance.setJsCode(t.context.jsCode);
  t.context.req = sinon.spy();
  t.context.res = sinon.spy();
});

test.cb('triggers bundle event', (t) => {
  t.plan(2);

  t.context.krtekInstance.on('bundle', (req, res) => {
    t.is(req, t.context.req);
    t.is(res, t.context.res);
    t.end();
  });

  t.context.krtekInstance.bundle(
    t.context.req,
    t.context.res
  );
});

test('throws error if jsCode not given', (t) => {
  t.context.krtekInstance.setJsCode(null);

  t.throws(
    () => t.context.krtekInstance.bundle(t.context.req, t.context.res),
    /Nothing to bundle - no JavaScript code given./
  );
});

test.cb('loads code from cache if any', (t) => {
  t.plan(3);

  const code = '\'use strict\';';
  const cache = new Cache({
    string: code
  });
  t.context.krtekInstance.setJsCode(code);

  t.context.krtekInstance.on('done', (req, res, result) => {
    t.is(req, t.context.req);
    t.is(res, t.context.res);
    t.is(code, result);
    t.end();
  });

  cache.set(code).then(
    () => {
      t.context.krtekInstance.bundle(t.context.req, t.context.res);
    }
  );
});

test.cb('bundles the code', (t) => {
  t.plan(4);

  t.context.krtekInstance.minifier = null;
  t.context.krtekInstance.cacheOptions = null;
  t.context.krtekInstance.setJsCode(t.context.jsCode2);

  t.context.krtekInstance.on('done', (req, res, result) => {
    t.is(req, t.context.req);
    t.is(res, t.context.res);
    t.regex(result, /console\.log/);
    t.not(result, t.context.jsCode2);
    t.end();
  });

  t.context.krtekInstance.bundle(t.context.req, t.context.res);
});

test.cb('minifies the code', (t) => {
  t.plan(3);

  t.context.krtekInstance.bundler = null;
  t.context.krtekInstance.cacheOptions = null;
  t.context.krtekInstance.setJsCode(t.context.jsCode2);

  t.context.krtekInstance.on('done', (req, res, result) => {
    t.is(req, t.context.req);
    t.is(res, t.context.res);
    t.regex(result, /console\.log\(2\)/);
    t.end();
  });

  t.context.krtekInstance.bundle(t.context.req, t.context.res);
});

test.cb('caches the code', (t) => {
  t.plan(1);

  t.context.krtekInstance.bundler = null;
  t.context.krtekInstance.minifier = null;
  t.context.krtekInstance.setJsCode(t.context.jsCode2);

  t.context.krtekInstance.on('done', () => {
    const cache = new Cache({
      string: t.context.jsCode2
    });

    cache.get().then((cacheResult) => {
      t.is(cacheResult, t.context.jsCode2);
      t.end();
    });
  });

  t.context.krtekInstance.bundle(t.context.req, t.context.res);
});

test.cb('it does all the things sequentially', (t) => {
  t.plan(4);

  const random = Math.random().toString(36).slice(2);
  const code = `console.log('${random}'); console.log(1+ 1);`;

  t.context.krtekInstance.setJsCode(code);

  t.context.krtekInstance.on('done', (req, res, result) => {
    t.regex(result, new RegExp(random));
    t.regex(result, /console\.log\(2\)/);
    t.regex(result, /function/);
    const cache = new Cache({
      string: code
    });

    cache.get().then((cacheResult) => {
      t.is(cacheResult, result);
      t.end();
    });
  });

  t.context.krtekInstance.bundle(t.context.req, t.context.res);
});
