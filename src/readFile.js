import fs from 'fs';

const readFile = file => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf-8', (err, content) => {
    if (err) return reject(err);
    return resolve(content);
  });
});

export default readFile;
