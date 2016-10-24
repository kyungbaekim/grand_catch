var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Wishlist = mongoose.model('Wishlist');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var consts = require('../config/constant.js');
var secret = consts.jwtTokenSecret;

module.exports = {
  index: function(req, res) {
    console.log("requested user ID:", req.session.info.id)
    // check header or url parameters or post parameters for token
		var token = req.session.info.token || req.headers['x-access-token'];
		console.log("token:", token);
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          // console.log("decoded data:", req.decoded)
        }
      });
    } else {
      // if there is no token return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

    User.find({_id: req.session.info.id}, function(err, user){
      if(err){
        res.json(err);
      }
      else {
        if(req.decoded.email == user[0].email && req.decoded.password == user[0].password){
          Wishlist.find({_user: req.session.info.id}, function(err, wishlist){
            if(err){
              res.status(500).json({error: err});
            }
            else {
              res.json(wishlist);
            }
          })
        }
        else{
          console.log("They don't match!!")
        }
      }
    })
  },

  create: function(req, res) {
    console.log("body data:", req.body);
    var data = {
      product_detail: req.body,
      _user: req.params.uid
    }

    // check header or url parameters or post parameters for token
		var token = req.session.info.token || req.headers['x-access-token'];
		console.log("token:", token);
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          // console.log("decoded data:", req.decoded)
        }
      });
    } else {
      // if there is no token return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

    User.find({_id: req.session.info.id}, function(err, user){
      if(err){
        res.json(err);
      }
      else {
        if(req.decoded.email == user[0].email && req.decoded.password == user[0].password){
          User.findOne({_id: data._user}, function(err, user){
            if(user){ // if user exists, save wishlist data and updated user data
              var wishlist = new Wishlist(data);
              wishlist.save(function(err){
                if(err){
                  console.log('Error occurred while saving your wishlist', err);
                }
                else{ // return updated user data
                  console.log(wishlist)
                  User.findOneAndUpdate({_id: data._user}, {$push: {wishlist: wishlist._id}}, {new: true}, function(err, user){
                    if (!err) {
                      res.json(user);
                    } else {
                      res.status(500).json({error: err});
                    }
                  });
                }
              })
            }
            else{
              console.log(err)
              res.status(500).json({error: err});
            }
          })
        }
      }
    })
  },

  find: function(req, res) {
    // check header or url parameters or post parameters for token
		var token = req.session.info.token || req.headers['x-access-token'];
		console.log("token:", token);
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          // decoded_data = decoded;
          req.decoded = decoded;
          // console.log("decoded data:", req.decoded)
        }
      });
    } else {
      // if there is no token return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

    User.find({_id: req.session.info.id}, function(err, user){
      if(err){
        res.json(err);
      }
      else {
        if(req.decoded.email == user[0].email && req.decoded.password == user[0].password){
          Wishlist.find({_id: req.user_id}).deepPopulate('_user').exec(function(err, wishlist){
            if(err){
              res.status(500).json({error: err});
            }
            else {
              res.json(wishlist);
            }
          })
        }
      }
    })
  },

  delete: function(req, res) {
    console.log("requested data:", req.params)

    // check header or url parameters or post parameters for token
		var token = req.session.info.token || req.headers['x-access-token'];
		console.log("token:", token);
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          // decoded_data = decoded;
          req.decoded = decoded;
          // console.log("decoded data:", req.decoded)
        }
      });
    } else {
      // if there is no token return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

    User.find({_id: req.session.info.id}, function(err, user){
      if(err){
        res.json(err);
      }
      else {
        if(req.decoded.email == user[0].email && req.decoded.password == user[0].password){
          Wishlist.remove({_id: req.params.wid}, function(err){
            if(err){
              res.status(500).json({error: err});
            }
            else {
              User.findOneAndUpdate({_id: req.params.uid}, {$pull: {wishlist: req.params.wid}}, {new: true}, function(err, user){
                if (err) {
                  res.status(500).json({error: err});
                }
                else {
                  res.json('Successfully deleted')
                }
              });
            }
          })
        }
      }
    })
  }
}
