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
