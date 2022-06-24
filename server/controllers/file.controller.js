const fileService = require('../services/fileService');
const File = require('../models/File');
const User = require('../models/User');
const config = require('config');
const path = require('path');
const fs = require('fs');

class FileController {

  async createDir(req, res) {
    try {
      const { name, type, parentId } = req.body
      const file = new File({name, type, parentId, user: req.user.id})
      const parentFile = await File.findOne({_id: parentId})
      if(!parentFile) {
        file.path = name;
        await fileService.createDir(file)
      } else {
        file.path = `${parentFile.path}\\${file.name}`
        await fileService.createDir(file);
        parentFile.childs.push(file._id)
        await parentFile.save()
      }
      await file.save()
      return res.json(file)
    } catch (e) {
      console.log(e)
      return res.status(400).json(e)
    }
  };

  async getFiles (req, res) {
    try {
      const files = await File.find({ user: req.user.id, parentId: req.query.parentId });
      return res.json(files);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Server can\'t send files'});
    }
  };

  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      const parent = await File.findOne({ user: req.user.id, _id: req.body.parentId });
      const user = await User.findOne({ _id: req.user.id });

      if (user.usedSpace + file.size > user.diskSpace) {
        return res.status(400).json({ message: 'There no space on the disk' });
      }
      user.usedSpace = user.usedSpace + file.size;

      let filePath;
      if (parent) {
        filePath = path.join(config.get('filePath'), 'files' , user.id, parent.path, file.name);
      } else {
        filePath = path.join(config.get('filePath'), 'files' , user.id, file.name);
      }

      if (fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File is already exist' });
      }
      await file.mv(filePath);

      const type = file.name.split('.').pop();
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: parent?.path,
        parentId: parent?.parentId,
        user: user._id,
      });
      await dbFile.save();
      await user.save();

      await res.json(dbFile);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Upload error'});
    }
  };

}

module.exports = new FileController();
