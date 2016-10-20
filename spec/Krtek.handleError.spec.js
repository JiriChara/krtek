/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  t.context.req = sinon.spy();
  t.context.res = sinon.spy();
  t.context.error = 'error';
});

test.cb('triggers error event with correct params', (t) => {
  t.plan(3);

  t.context.krtekInstance.on('error', (req, res, error) => {
    t.is(req, t.context.req);
    t.is(res, t.context.res);
    t.is(error, t.context.error);
    t.end();
  });

  t.context.krtekInstance.handleError(
    t.context.req,
    t.context.res,
    t.context.error
  );
});
