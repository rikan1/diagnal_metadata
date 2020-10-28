const express = require('express');
const router = express.Router();

const ApiController = require('./../controller/api.controller');
const checkAuth = require('../middleware/checkauth');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/get-users",  ApiController.getAllUsers);

router.post('/sign-up',ApiController.createNewUser);

router.post('/login', ApiController.login);

module.exports = router;
