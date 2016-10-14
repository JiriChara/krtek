/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import express from 'express';
import browserify from 'browserify-string';

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

test('initializes browserify', (t) => {
  t.is(
    t.context.krtekInstance.browserify,
    browserify
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

test('inits port', (t) => {
  t.is(
    t.context.krtekInstance.port,
    3000
  );
});

test('inits host process.env.HOST', (t) => {
  process.env.PORT = 4000;
  t.is(
    new Krtek().port,
    '4000'
  );
});
