const mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
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
    trim: true
  },
  content:{
    type: String,
    trim: true
  },
  folderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'folders'
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

var File = mongoose.model("files", FileSchema);

File.syncIndexes();

module.exports = { File };
