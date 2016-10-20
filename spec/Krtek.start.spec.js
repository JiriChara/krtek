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

test('configures middleware', (t) => {
  sinon.stub(t.context.krtekInstance, 'configureMiddleware');
  sinon.stub(t.context.krtekInstance.app, 'listen');

  t.context.krtekInstance.start();

  t.true(t.context.krtekInstance.configureMiddleware.called);
});

test('starts express', (t) => {
  sinon.stub(t.context.krtekInstance.app, 'listen');

  t.context.krtekInstance.start();

  t.true(t.context.krtekInstance.app.listen.called);
});

test.cb('triggers start method', (t) => {
  t.plan(1);

  t.context.krtekInstance.on('start', () => {
    t.pass();
    t.end();
  });

  t.context.krtekInstance.start();
});

test('calls listen method with correct port', (t) => {
  const stub = sinon.stub(t.context.krtekInstance.app, 'listen');

  t.context.krtekInstance.start();

  t.true(stub.calledWith(
    t.context.krtekInstance.port,
    sinon.match.any,
    sinon.match.any
  ));

  t.context.krtekInstance.port = 4000;
  t.context.krtekInstance.start();

  t.true(stub.calledWith(
    t.context.krtekInstance.port,
    sinon.match.any,
    sinon.match.any
  ));
});

test('calls listen method with correct host', (t) => {
  const stub = sinon.stub(t.context.krtekInstance.app, 'listen');

  t.context.krtekInstance.start();

  t.true(stub.calledWith(
    sinon.match.any,
    t.context.krtekInstance.host,
    sinon.match.any
  ));

  t.context.krtekInstance.host = 'foobar.com';
  t.context.krtekInstance.start();

  t.true(stub.calledWith(
    sinon.match.any,
    t.context.krtekInstance.host,
    sinon.match.any
  ));
});
