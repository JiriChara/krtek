/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import express from 'express';
import sinon from 'sinon';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
  delete process.env.HOST;
  delete process.env.PORT;
});

test('initializes express app', (t) => {
  t.deepEqual(
    JSON.stringify(t.context.krtekInstance.app),
    JSON.stringify(express())
  );
});

test('initializes express app to given one', (t) => {
  const app = sinon.spy();

  t.is(
    new Krtek({ app }).app,
    app
  );
});

test('inits host', (t) => {
  t.is(
    t.context.krtekInstance.host,
    'localhost'
  );
});

test('inits host process.env.HOST', (t) => {
  process.env.HOST = 'foo';
  t.is(
    new Krtek().host,
    'foo'
  );
});

test('inits host to given one', (t) => {
  t.is(
    new Krtek({ host: 'foo' }).host,
    'foo'
  );
});

test('inits port', (t) => {
  t.is(
    t.context.krtekInstance.port,
    3000
  );
});

test('inits port process.env.PORT', (t) => {
  process.env.PORT = 4000;
  t.is(
    new Krtek().port,
    '4000'
  );
});

test('inits port to given one', (t) => {
  t.is(
    new Krtek({ port: 1234 }).port,
    1234
  );
});

test('inits headers', (t) => {
  t.deepEqual(
    t.context.krtekInstance.headers,
    {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': 'localhost',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  );
});

test('inits headers to given one', (t) => {
  t.deepEqual(
    new Krtek({ headers: { foo: 1 } }).headers,
    { foo: 1 }
  );
});
