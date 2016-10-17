/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import request from 'supertest-as-promised';

import Krtek from '../src/Krtek';

test.beforeEach((t) => {
  t.context.krtekInstance = new Krtek();
});

test('adds / route by default', async (t) => {
  t.plan(3);

  t.context.krtekInstance.configureMiddleware();

  const res = await request(t.context.krtekInstance.app)
    .get('/')
    .send();

  t.is(res.status, 200);
  t.is(res.type, 'text/html');
  t.regex(res.text, /Krtek is running/);
});
