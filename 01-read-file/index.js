const fs = require('fs');
const path = require('path');

const filename = path.join(__dirname, 'text.txt');
const file = new fs.ReadStream(filename, 'utf8');

file.on('data', (message) => console.log(message));
file.on('error', (error) => console.log('Error: ', error));
