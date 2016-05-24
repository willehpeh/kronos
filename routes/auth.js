var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model("User");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var config = require('../config/config');

// Allow new users to sign up (reactivate only if necessary)
router.route('/signup')
  .post(function(req, res, next) {

    // Retrieve username and password from request
    var username = req.body.username;
    var password = req.body.password;
    var admin = req.body.admin;
    var retailer = req.body.retailer;

    // Check if user already exists
    User.findOne({ name: username }, function(err, user) {
      if(err) {
        return res.status(500).send({success: false, message: "Database error."});
      }
      if(user) {
        return res.status(401).send({success: false, message: "User already exists."});
      }
      else {
        // Create new user
        var user = new User();
        user.name = username;
        user.admin = admin;
        user.retailer = retailer;

        // Create password hash and store to db
        var passwordHash = crypto
          .createHmac('sha256', config.secret)
          .update(password)
          .digest('hex');
        user.password = passwordHash;

        user.save(function(err, user) {
          if(err) {
            return res.status(500).send({success: false, message: "Database error."});
          }
        });

        // Create and serve token
        var token = jwt.sign(user, config.secret, {
          expiresIn: 3600 // expires in 60 minutes
        });
        return res.status(200).send({success: true, token: token, message: "Authentication successful."});
      }
    });
  });


router.route('/login')
  .post(function(req, res, next) {

    // Retrieve username and password from request
    var username = req.body.username;
    var password = req.body.password;

    // Create password hash using secret key
    var passwordHash = crypto
      .createHmac('sha256', config.secret)
      .update(password)
      .digest('hex');

    // Attempt to authenticate user
    User.findOne({ name: username }, function(err, user) {
      if(err) {
        return res.status(500).send({success: false, message: "Database error."});
      }
      if(!user) {
        return res.status(401).send({success: false, message: "Invalid username."});
      }
      if(user.password != passwordHash) {
        return res.status(401).send({success: false, message: "Incorrect password."});
      }

      // Username and password correct, supply token
      if(user.password == passwordHash) {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 3600 // expires in 60 minutes
        });
        return res.status(200).send({success: true, user: user._id, token: token, message: "Authentication successful."});
      }
    });
  });

module.exports = router;
