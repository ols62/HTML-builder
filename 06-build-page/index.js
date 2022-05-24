const path = require('path');
const { copyFile, readdir, mkdir } = require('fs/promises');
const fs = require('fs');

const distdirname = path.join(__dirname, 'project-dist');
const assetsdirname = path.join(__dirname, 'assets');
const stylesdir = path.join(__dirname, 'styles');
const distdir = path.join(__dirname, 'project-dist');
const stylesfilename = path.join(distdir, 'style.css');
const stylesfile = new fs.WriteStream(stylesfilename, 'utf8');
let content = [];
let indexpart = [];

const createdist = async () => {
  try {
    await mkdir(distdirname, { recursive: true });
    const adir = path.join(distdirname, 'assets');
    await mkdir(adir, { recursive: true });
    await copyassest(assetsdirname, adir);
    const files = await readdir(assetsdirname, { withFileTypes: true });
    for (const file of files) {
      const dist = path.join(adir, file.name);
      const src = path.join(assetsdirname, file.name);
      await copyassest(src, dist);
    }
  } catch (err) {
    console.error(err);
  }
};

const copyassest = async (copydir, distdir) => {
  try {
    const files = await readdir(copydir, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        const dist = path.join(distdir, file.name);
        await mkdir(dist, { recursive: true });
      }
      if (file.isFile()) {
        const filename = path.join(copydir, file.name);
        const copyfilename = path.join(distdir, file.name);
        await copyFile(filename, copyfilename);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

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

const copystyle = async () => {
  try {
    const files = await readdir(stylesdir, { withFileTypes: true });
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

const createindex = async () => {
  indexpart.push({ tag: 'index', body: ' ' });
  const componentsdir = path.join(__dirname, 'components');
  const files = await readdir(componentsdir, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const filename = path.join(componentsdir, file.name);
      const fname = path.parse(file.name);
      indexpart.push({ tag: fname.name, body: '' });
      const readfile = new fs.ReadStream(filename, 'utf8');
      readfile.on('data', (message) => {
        const name = path.parse(file.name);
        for (const item of indexpart) {
          if (item.tag == name.name) {
            item.body += message;
          }
        }
      });
      readfile.on('error', (error) => console.log('Error: ', error));
      readfile.on('end', () => {
        readfile.destroy;
      });
    }
  }

  const filename = path.join(__dirname, 'template.html');
  const file = new fs.ReadStream(filename, 'utf8');
  file.on('data', (message) => {
    indexpart[0].body += message;
  });
  file.on('error', (error) => console.log('Error: ', error));
  file.on('end', () => {
    file.destroy;
    for (const item of indexpart) {
      if (item != 'index') {
        let tag = '{{' + item.tag + '}}';
        indexpart[0].body = indexpart[0].body.replace(tag, item.body);
      }
    }
    const indexdist = path.join(distdir, 'index.html');
    const indexfile = new fs.WriteStream(indexdist, 'utf8');
    indexfile.write(indexpart[0].body);
    console.log(indexpart[0].body);
  });
};

createdist();
copystyle();
createindex();
