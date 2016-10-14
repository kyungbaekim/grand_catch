var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Wishlist = mongoose.model('Wishlist');
var User = mongoose.model('User');

module.exports = {
  index: function(req, res) {
    console.log("requested user ID:", req.params.uid)
    Wishlist.find({_user: req.params.uid}, function(err, wishlist){
      if(err){
        res.json('error from index:', err);
      }
      else {
        res.json(wishlist);
      }
    })
  },

  create: function(req, res) {
    // console.log("body data:", req.body);
    var data = {
      seller: req.body.seller,
      product_name: req.body.title,
      product_id: req.body.id,
      product_url: req.body.view,
      product_img_url: req.body.img,
      _user: req.body.uid
    }
    User.findOne({_id: req.body.uid}, function(err, user){
      if(user){ // if user exists, save wishlist data and updated user data
        var wishlist = new Wishlist(data);
        wishlist.save(function(err){
          if(err){
            console.log('Error occurred while saving your wishlist', err);
          }
          else{ // return updated user data
            User.findOneAndUpdate({_id: req.body.uid}, {$push: {wishlist: wishlist._id}}, {new: true}, function(err, user){
              if (!err) {
                res.json(user);
              } else {
                res.json(err);
              }
            });
          }
        })
      }
      else{
        console.log(err)
      }
    })
  },

  find: function(req, res) {
    Wishlist.find({_id: req.user_id}).deepPopulate('_user').exec(function(err, wishlist){
      if(err){
        res.json(err);
      }
      else {
        res.json(wishlist);
      }
    })
  },

  delete: function(req, res) {
    Wishlist.remove({_id: req.params.id}, function(err){
      if(err){
        console.log(err);
      }
      else {
        res.redirect('/');
      }
    })
  }
}
