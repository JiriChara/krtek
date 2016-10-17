import fs from 'fs';

const writeFile = (file, data) => new Promise((resolve, reject) => {
  fs.writeFile(file, data, (err) => {
    if (err) return reject(err);

    return resolve(data);
  });
});

export default writeFile;
