const fs = require('fs');
const path = require('path');

class FileService {

  createDir(req, file) {
    const dir = req.filePath;

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    const filePath = this.getPath(req, file);
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

  deleteFile(req, file) {
    if (file.type === 'dir') {
      fs.rmdirSync(file.path);
    } else {
      fs.unlinkSync(file.path);
    }
  }

  getPath(req, file) {
    if ( file.type === 'dir') {
      return path.join(`${req.filePath}`, `${file.user}`, `${file.path}`);
    }
    return path.join(`${req.filePath}`, `${file.user}`, `${file.name}`);
  }

}

module.exports = new FileService();
