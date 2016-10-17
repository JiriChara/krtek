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

test('inits cacheFolder', (t) => {
  t.is(
    t.context.krtekInstance.cacheFolder,
    '/tmp'
  );
});

test('inits cacheFolder to given one', (t) => {
  t.is(
    new Krtek({ cacheFolder: '/foo' }).cacheFolder,
    '/foo'
  );
});

test('inits contentType', (t) => {
  t.is(
    t.context.krtekInstance.contentType,
    'application/javascript'
  );
});

test('inits contentType to given one', (t) => {
  t.is(
    new Krtek({ contentType: 'application/whatever' }).contentType,
    'application/whatever'
  );
});

test('inits origin', (t) => {
  t.is(
    t.context.krtekInstance.origin,
    'localhost'
  );
});

test('inits origin to given one', (t) => {
  t.is(
    new Krtek({ origin: 'myserver.com' }).origin,
    'myserver.com'
  );
});

test('inits cache', (t) => {
  t.is(
    t.context.krtekInstance.cache,
    true
  );
});

test('inits cache to given one', (t) => {
  t.is(
    new Krtek({ cache: false }).cache,
    false
  );
});

test('inits minify', (t) => {
  t.is(
    t.context.krtekInstance.minify,
    true
  );
});

test('inits minify to given one', (t) => {
  t.is(
    new Krtek({ minify: false }).minify,
    false
  );
});
