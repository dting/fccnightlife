'use strict';

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  _id: {type:String, required: true},
  name: {type:String, required: true},
  rating_img_url: {type:String, required: true},
  going: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

PlaceSchema.plugin(findOrCreate);

module.exports = mongoose.model('Place', PlaceSchema);
