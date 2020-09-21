var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile/:id', function(req, res, next) {
  let profileId = parseInt(req.params.id);
});


module.exports = router;
