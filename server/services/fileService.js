const fs = require('fs');
const config = require('config');
const path = require('path');

class FileService {

  createDir(file) {
    const dir = path.join(`${config.get('filePath')}`, `files`);

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, `${file.user}`, `${file.path}`);
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: 'File was created' });
        } else {
          return reject({ message: 'File is already exists'});
        }
      } catch (e) {
        return reject({ message: 'File error'});
      }
    })
  }

  deleteFile(file) {
    const filePath = this.getPath(file);
    if (file.type === 'dir') {
      fs.rmdirSync(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }

  getPath(file) {
    if ( file.type === 'dir') {
      return path.join(`${config.get('filePath')}`, `files`, `${file.user}`, `${file.path}`);
    }
    return path.join(`${config.get('filePath')}`, `files`, `${file.user}`, `${file.name}`);
  }

}

module.exports = new FileService();
