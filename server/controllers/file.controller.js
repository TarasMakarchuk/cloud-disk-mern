const fileService = require('../services/fileService');
const File = require('../models/File');
const User = require('../models/User');
const config = require('config');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

class FileController {

  async createDir(req, res) {
    try {
      const { name, type, parentId } = req.body
      const file = new File({name, type, parentId, user: req.user.id})
      const parentFile = await File.findOne({_id: parentId})

      if (!parentFile) {
        file.path = name;
        await fileService.createDir(req, file);
      } else {
        file.path = path.join(parentFile.path, file.name);
        await fileService.createDir(req, file);
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
      return res.status(500).json({ message: 'Server can\'t send files' });
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
        filePath = path.join(req.filePath, user.id, parent.path, file.name);
      } else {
        filePath = path.join(req.filePath , user.id, file.name);
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
        parentId: parent ? parent._id : null,
        user: user._id,
      });
      await dbFile.save();
      await user.save();

      await res.json(dbFile);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Upload error' });
    }
  };

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      const filePath = file.path;

      if (fs.existsSync(filePath)) {
        return res.download(filePath, file.name);
      }

      return res.status(400).json({ message: 'Download error' });

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Download error' });
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      if (!file) {
        await res.status(400).json({ message: 'file not found' });
      }
      fileService.deleteFile(req, file);
      await file.remove();

      if (file.type === 'dir') {
        return res.json({ message: 'Dir was deleted' });
      }

      return res.json({ message: 'File was deleted' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Dir should be empty' });
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
      return res.status(400).json({ message: 'Search error' });
    }
  }

  async uploadAvatar(req, res) {
    const oneKb = 1024;
    const minSize = oneKb*100;
    const maxSize = oneKb*oneKb*2;
    const regExp = /\/(jpg|jpeg|gif|png)$/;

    if(!req.files) {
      return res.status(400).json({ message: "File should be selected" });
    }

    try {
      const file = req.files.file;
      const dir = path.join(`${config.get('filePath')}`, `static`);

      if (!file.mimetype.match(regExp)) {
        return res.status(400).json({ message: "Avatar should be image type" });
      }
      if (file.size < minSize) {
        return res.status(400).json({ message: `Avatar size should be more than ${minSize/oneKb} Kb` });
      }
      if (file.size > maxSize) {
        return res.status(400).json({ message: `Avatar size should be less than ${maxSize/oneKb/oneKb} Mb` });
      }

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      const user = await User.findById(req.user.id);

      if (user.avatar) {
        fs.unlinkSync(path.join(dir, user.avatar));
      }

      const avatarName = `${uuid.v4()}.jpg`;
      await file.mv(path.join(dir, avatarName));
      user.avatar = avatarName;
      await user.save();

      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Avatar upload error' });
    }
  }

  async deleteAvatar(req, res) {
    try {
      const dir = path.join(`${config.get('filePath')}`, `static`);
      const user = await User.findById(req.user.id);
      fs.unlinkSync(path.join(dir, user.avatar));
      user.avatar = null;
      await user.save();

      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Delete avatar error' });
    }
  }

}

module.exports = new FileController();
