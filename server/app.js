/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var CronJob = require('cron').CronJob;

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Setup nightly database clean up. Places dropped at 4AM PST.
new CronJob({
  cronTime: '0 0 4 * * *',
  onTick: function() {
    mongoose.connection.db.dropCollection('places', function(err, result) {
      if (err) { console.log(Date.now() + ' error dropping places: ' + err); }
      else { console.log(Date.now() + ' places dropped: ' + result); }
    });
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
