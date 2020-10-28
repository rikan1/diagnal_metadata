//middleware fro check the token validation for mobile user
const jwt = require('jsonwebtoken');
const { User }  = require('../models/users.model');
// import config from "../config";

module.exports = async (req, res, next) => {
  try {

    if(!req.headers.authorization){
        return res.status(401).json({
            message: 'Please provide a token',
          });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); ///verify jwt with fcm token

    const user = await User.findById(decoded.id);
    if(user){
        req.user = user;
        next();
    }else{
        res.status(401).send({message: 'Please login again'});
    }
    
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};
