const mongoose = require('mongoose');

var FolderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true,'userId is required'],
    ref: 'users'
  },
  description: {
    type: String,
    trim: true
  },
  name:{
    type: String,
    required: [true,'name is required'],
    trim: true,
    index: true
  }
},{
  timestamps : true
});


mongoose.plugin(schema => {
  schema.pre('findOneAndUpdate', setRunValidators);
  schema.pre('updateMany', setRunValidators);
  schema.pre('updateOne', setRunValidators);
  schema.pre('update', setRunValidators);
});

function setRunValidators() {
  this.setOptions({ runValidators: true });
}

FolderSchema.index({'userId':1,'name':1});

var Folder = mongoose.model("folders", FolderSchema);

Folder.syncIndexes();

module.exports = { Folder };
