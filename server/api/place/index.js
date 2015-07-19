'use strict';

var express = require('express');
var controller = require('./place.controller');

var router = express.Router();

router.get('/location/:location', controller.location);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);

module.exports = router;
