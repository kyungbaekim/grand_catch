var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Wishlist = mongoose.model('Wishlist');
var User = mongoose.model('User');

module.exports = {
  index: function(req, res) {
    Wishlist.find({}).deepPopulate('_user').exec(function(err, wishlist){
      if(err){
        res.json(err);
      }
      else {
        res.json(wishlist);
      }
    })
  },
  
  create: function(req, res) {
    console.log(req.body);
    // User.findOne({_id: req.params.id}, function(err, user){
    //   var wishlist = new Wishlist({seller: req.body.seller, product_name: req.body.title, product_id: req.body.id, product_url: req.body.view, product_img_url: req.body.img, _user: user._id});
    //   wishlist.save(function(err){
    //     if(err){
    //       console.log('Error occurred while saving your wishlist', err);
    //     }
    //     else{
    //       user.wishlist.push(wishlist._id);
    //       user.save(function(err) {
    //         if(err) {
    //           res.json({message: 'Error occurred while updating your wishlist', error: wishlist.errors});
    //         } else {
    //           console.log('your wishlist successfully saved!', wishlist);
    //           res.json(wishlist);
    //         }
    //       });
    //     }
    //   });
    // });
  },
  find: function(req, res) {
    Wishlist.find({_id: req.params.id}).deepPopulate('_user posts posts._user posts.comments posts.comments._user posts.comments.comment').exec(function(err, wishlist){
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
