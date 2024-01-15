/* eslint-disable no-underscore-dangle */
const fs = require('fs');

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  deleteFile(fileName) {
    const filePath = `${this._folder}/${fileName}`;

    fs.unlink(filePath, (error) => {
      if (error) {
        console.log('File tidak ditemukan');
      } else {
        console.log('File telah dihapus');
      }
    });
  }
}

module.exports = StorageService;
