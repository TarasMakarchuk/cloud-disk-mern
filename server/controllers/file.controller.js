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
      if (!parentFile) {
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
      const { sort } = req.query;
      let files;

      switch (sort) {
        case 'name':
          files = await File.find({ user: req.user.id, parentId: req.query.parentId }).sort({ name: 1 });
          break;
        case 'type':
          files = await File.find({ user: req.user.id, parentId: req.query.parentId }).sort({ type: 1 });
          break;
        case 'date':
          files = await File.find({ user: req.user.id, parentId: req.query.parentId }).sort({ date: 1 });
          break;

        default:
          files = await File.find({ user: req.user.id, parentId: req.query.parentId });
          break;
      }

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
        path: filePath,
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

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      const filePath = path.join(config.get('filePath'), 'files', req.user.id, file.path, file.name);

      if (fs.existsSync(filePath)) {
        return res.download(filePath, file.name);
      }

      return res.status(400).json({ message: 'Download error'});

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Download error'});
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      if (!file) {
        await res.status(400).json({ message: 'file not found'})
      }
      fileService.deleteFile(file);
      await file.remove();

      if (file.type === 'dir') {
        return res.json({ message: 'Dir was deleted' });
      }

      return res.json({ message: 'File was deleted' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Dir should be empty'})
    }
  }

  async searchFile(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user: req.user.id });
      files = files.filter(file => file.name.includes(searchName));
      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Search error'});
    }
  }

}

module.exports = new FileController();
