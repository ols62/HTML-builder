const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');

const filename = path.join(__dirname, 'text.txt');
const file = new fs.WriteStream(filename, 'utf8');

const readln = readline.createInterface(process.stdin);
console.log('Please enter text: ');

process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => {
  readln.close();
  file.destroy();
  console.log('The program has stopped. Goodbye!');
});

process.stdin.on('data', (text) => {
  file.write(text);
});

readln.on('line', (message) => {
  if (message === 'exit') {
    process.exit();
  }
});
file.on('error', (error) => console.log('Error: ', error));