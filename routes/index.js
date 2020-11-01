var express = require('express');
var router = express.Router();

const ApiController  = require('../controller/api.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/parse-url',ApiController.parseUrl);

module.exports = router;
