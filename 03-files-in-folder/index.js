const { readdir } = require('fs/promises');
const path = require('path');
const { stat } = require('fs');

const dirname = path.join(__dirname, 'secret-folder');

const read = async () => {
  try {
    const files = await readdir(dirname, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const detail = path.parse(file.name);
        const pfile = path.join(dirname, file.name);
        stat(pfile, (err, stats) => {
          console.log(
            detail.base + ' - ' + detail.ext + ' - ' + stats.size / 1000 + 'kb'
          );
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
};

read();
