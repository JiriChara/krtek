/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.req = sinon.spy();
  t.context.res = sinon.spy();
  t.context.code = 'var foo = 1 + 1;';
});

test.cb('triggers done event with correct params', (t) => {
  t.plan(3);

  t.context.krtekInstance.on('done', (req, res, code) => {
    t.is(req, t.context.req);
    t.is(res, t.context.res);
    t.is(code, t.context.code);
    t.end();
  });

  t.context.krtekInstance.handleDone(
    t.context.req,
    t.context.res,
    t.context.code
  );
});
