/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Place = require('../api/place/place.model');

User.find({}).remove(function() {
});

Place.find({}).remove(function() {
});
