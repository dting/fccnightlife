'use strict';

var _ = require('lodash');
var Place = require('./place.model');
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
    var places = _.map(data.businesses, function(obj) { return _.pick(obj, ['name', 'url', 'rating', 'rating_img_url'])});
    return res.json(200, places);
  });
};

// Get a single place
exports.show = function(req, res) {
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      return handleError(res, err);
    }
    if (!place) {
      return res.send(404);
    }
    return res.json(place);
  });
};

// Creates a new place in the DB.
exports.create = function(req, res) {
  Place.create(req.body, function(err, place) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, place);
  });
};

// Updates an existing place in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Place.findById(req.params.id, function(err, place) {
    if (err) {
      return handleError(res, err);
    }
    if (!place) {
      return res.send(404);
    }
    var updated = _.merge(place, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, place);
    });
  });
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
