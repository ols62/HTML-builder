const path = require('path');
const { copyFile, readdir, mkdir, rm } = require('fs/promises');

const dirname = path.join(__dirname, 'files');
const copydirname = path.join(__dirname, 'files-copy');

const read = async () => {
  try {
    await rm(copydirname, { force: true, recursive: true });
    await mkdir(copydirname, { recursive: true });
    const files = await readdir(dirname, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filename = path.join(dirname, file.name);
        const copyfilename = path.join(copydirname, file.name);
        await copyFile(filename, copyfilename);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

read();
