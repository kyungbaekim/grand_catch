var mongoose = require('mongoose');

// var WishlistSchema = new mongoose.Schema({
//   _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//   seller: {type: String, required: [true, 'Seller cannot be blank']},
// 	product_name: {type: String, required: [true, 'Product name cannot be blank']},
//   product_id: {type: String, required: [true, 'Product id cannot be blank']},
// 	product_url: {type: String, required: [true, 'Product view URL cannot be blank']},
//   product_img_url: {type: String, required: [true, 'Product image URL cannot be blank']},
// }, {timestamps: true})

var WishlistSchema = new mongoose.Schema({
  _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  product_detail: [{}]
}, {timestamps: true})

var deepPopulate = require('mongoose-deep-populate')(mongoose);
WishlistSchema.plugin(deepPopulate);
mongoose.model('Wishlist', WishlistSchema)
