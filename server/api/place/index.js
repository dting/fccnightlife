'use strict';

var express = require('express');
var controller = require('./place.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/location/:location', controller.location);
router.put('/:id', auth.isAuthenticated(), controller.addMe);
router.patch('/:id', auth.isAuthenticated(), controller.removeMe);

module.exports = router;
