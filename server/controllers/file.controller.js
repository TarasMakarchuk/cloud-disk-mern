const fileService = require('../services/fileService');
const File = require('../models/File');

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
      const files = await File.find({ user: req.user.id, parentId: req.query.parentId});
      return res.json(files);

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Server can\'t send files'});
    }
  };

}

module.exports = new FileController();
