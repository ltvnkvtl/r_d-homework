const fs = require('fs');
const zlib = require('zlib');

const r = fs.createReadStream('book.txt.gz');
const z = zlib.createGunzip();
const w = fs.createWriteStream('book2.txt');
r.pipe(z).pipe(w);
