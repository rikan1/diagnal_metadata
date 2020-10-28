const express = require('express');
const router = express.Router();

const ApiController = require('./../controller/api.controller');
const checkAuth = require('../middleware/checkauth');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
