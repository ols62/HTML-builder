const path = require('path');
const fs = require('fs');
const fsream = require('fs/promises');
const stylesdir = path.join(__dirname, 'styles');
const distdir = path.join(__dirname, 'project-dist');
const stylesfilename = path.join(distdir, 'bundle.css');
const stylesfile = new fs.WriteStream(stylesfilename, 'utf8');
let content = [];

const readcontent = async (filename, number) => {
  const file = new fs.ReadStream(filename, 'utf8');

  file.on('data', (message) => {
    if (message != undefined) {
      content[number] += message;
    }
  });
  file.on('error', (error) => console.log('Error: ', error));
  file.on('end', () => {
    file.destroy;
    stylesfile.write(content[number]);
  });
};

const read = async () => {
  try {
    const files = await fsream.readdir(stylesdir, { withFileTypes: true });
    let number = 0;
    for (const file of files) {
      if (file.isFile()) {
        const filename = path.join(stylesdir, file.name);
        const detail = path.parse(file.name);
        if (detail.ext === '.css') {
          await readcontent(filename, number);
          content[number] = '';
          number++;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};
read();
