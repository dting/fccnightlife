'use strict';

var _ = require('lodash');
var Place = require('./place.model');
var async = require('async');
var config = require('../../config/environment');
var yelp = require('yelp').createClient({
  consumer_key: config.yelp.clientID,
  consumer_secret: config.yelp.clientSecret,
  token: config.yelp.token,
  token_secret: config.yelp.token_secret
});

// Get list of places for a location
exports.location = function(req, res) {
  yelp.search({term: "bar", location: req.params.location}, function(err, data) {
    if (err) {return handleError(res, err);}
    if (!data) {return res.send(404);}
    async.map(data.businesses, findOrCreate, function(err, results) {
      if (err) {return handleError(res, err);}
      console.log(results);
      return res.json(200, results);
    });
  });
};

// Finds or creates a place using the yelp url.
function findOrCreate(business, callback) {
  Place.findOrCreate({url:business.url}, function(err, place, created) {
    if (created) {
      place.url = business.url;
      place.name = business.name;
      place.rating_img_url = business.rating_img_url;
      place.save(function(saveErr) {
        callback(saveErr, place)
      });
    } else {
      callback(null, place);
    }
  });
}

exports.addMe = function(req, res) {
  var userId = req.user.id;
  Place.findById(req.params.id, function(err, place) {
    if (err) {return handleError(res, err);}
    if (_.indexOf(place.going, userId) < 0) {
      place.going.push(userId);
      place.save(function(saveErr) {
        if (saveErr) {return handleError(res, saveErr)}
        return res.json(200, place);
      });
    } else {
      return res.json(200, place);
    }
  });
};

exports.removeMe = function(req, res) {
  var userId = req.user.id;
  Place.findById(req.params.id, function(err, place) {
    if (err) {return handleError(res, err);}
    place.going.pull(userId);
    place.save(function(saveErr) {
      if (saveErr) {return handleError(res, saveErr)}
      return res.json(200, place);
    });
  })
};

// Deletes a place from the DB.
exports.destroy = function(req, res) {
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      return handleError(res, err);
    }
    if (!place) {
      return res.send(404);
    }
    place.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
