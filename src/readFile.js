import fs from 'fs';

const readFile = (file, callback) => fs.readFile(file, 'utf-8', callback);

export default readFile;
