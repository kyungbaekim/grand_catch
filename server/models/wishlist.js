var mongoose = require('mongoose');

var WishlistSchema = new mongoose.Schema({
  _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  product_detail: [{}]
}, {timestamps: true})

var deepPopulate = require('mongoose-deep-populate')(mongoose);
WishlistSchema.plugin(deepPopulate);
mongoose.model('Wishlist', WishlistSchema)
