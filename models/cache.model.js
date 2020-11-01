const mongoose = require('mongoose');

var CacheSchema = new mongoose.Schema({
  baseUrl: {
    type: String,
    trim: true,
    index: true
    // required: [true,'Name is required']
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image:{
    type: String
  },
  keywords:{
    type: Array,
    default: []
  }
},{
  timestamps : true
});
 
const Cache = mongoose.model("cache", CacheSchema);

Cache.syncIndexes();

module.exports = { Cache };
