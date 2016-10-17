/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import fs from 'fs';

import FileProvider from '../../src/cache/FileProvider';

test.beforeEach((t) => {
  t.context.fileProviderInstance = new FileProvider();
  t.context.hash = 'foo';
  t.context.string = 'Some very very very long string';
  t.context.filePath = t.context.fileProviderInstance.getFilePath(
    t.context.hash
  );
});

test.cb('caches string in a file', (t) => {
  t.pass(1);

  t.context.fileProviderInstance.set(
    t.context.hash,
    t.context.string,
    () => {
      fs.readFile(t.context.filePath, 'utf-8', (err, content) => {
        t.is(content, t.context.string);
        t.end();
      });
    }
  );
});

test.cb('returns an error if caching fails', (t) => {
  t.pass(1);

  const provider = new FileProvider({
    folder: '/some/folder/that/doesnt/exist'
  });

  provider.set(
    t.context.hash,
    t.context.string,
    (error) => {
      t.regex(
        error.message,
        /ENOENT: no such file or directory/
      );
      t.end();
    }
  );
});
