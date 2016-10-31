//go back up 2 folders and to controllers routes
var users = require('../controllers/users.js')
var aws = require('../controllers/aws.js')
var wishlist = require('../controllers/wishlists.js')
var jwt = require('jsonwebtoken');
var consts = require('../config/constant.js');
var secret = consts.jwtTokenSecret;

module.exports = function(app){
	app.post('/search', function(req, res){
		aws.itemSearch(req, res);
	})

	app.get('/topSellers/:department', function (req, res){
		aws.topSellers(req, res);
	})

	app.get('/itemLookUp/:asin', function (req, res){
		aws.itemLookUp(req, res);
	})

	app.post('/user', function (req, res){
		users.create(req, res);
	})

	app.get('/getUsers', function (req, res){
		users.index(req, res);
	})

	app.post('/login', function (req, res){
		// console.log("Header X-CSRF token info:", req.header('X-CSRFToken'))
		users.login(req, res);
	})

	app.post('/forgot', function (req, res, next){
		users.forgot(req, res, next);
	})

	app.get('/logout', function (req, res){
		users.logout(req, res)
	})

	app.get('/session_user', function (req, res){
		users.getSession(req, res);
	})

	app.post('/addToWishlist/:uid', restrict, function (req, res){
		console.log(req.body)
		wishlist.create(req, res)
	})

	app.get('/getUserWishlist/:uid', restrict, function (req, res){
		wishlist.index(req, res)
	})

	app.post('/wishlist/delete/:wid/:uid', restrict, function (req, res){
		wishlist.delete(req, res)
	})

	function restrict(req, res, next) {
		console.log("In restrict function:", req.session)
	  if (req.session.loggedIn && req.session.info && req.session.info.id == req.params.uid) {
			var token = req.session.info.token || req.headers['x-access-token'];
			console.log("token:", token)
		  // decode token
		  if (token) {
		    // verifies secret and checks exp
		    jwt.verify(token, secret, function(err, decoded) {
		      if (err) {
		        return res.json({ success: false, message: 'Failed to authenticate token.' });
		      } else {
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded;
		        next();
		      }
		    });
		  } else {
		    // if there is no token return an error
		    return res.status(403).send({
		        success: false,
		        message: 'No token provided.'
		    });
		  }
	  } else {
			console.log(req.session)
			console.log('Access denied! Please log in again!')
	  }
	}
}
