'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  name: {type:String, required: true},
  going: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Place', PlaceSchema);
