const fs = require('fs');
const path = require('path');

const filename = path.join(__dirname, 'text.txt');
let file = new fs.ReadStream(filename, 'utf8');

file.on('data', (message) => console.log('Content: ', message));
file.on('error', (error) => console.log('Error: ', error));
