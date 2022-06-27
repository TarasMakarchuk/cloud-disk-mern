const {Schema, model, ObjectId} = require('mongoose');

const File = new Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  accessLink: {type: String},
  date: {type: Date, default: Date.now()},
  size: {type: Number, default: 0},
  path: {type: String, default: ''},
  user: {type: ObjectId, ref: 'User'},
  parentId: {type: ObjectId, ref: 'File'},
  childs: [{type: ObjectId, ref: 'File'}],
})

module.exports = model('File', File);
