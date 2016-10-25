//go back up 2 folders and to controllers routes
var users = require('../controllers/users.js')
var aws = require('../controllers/aws.js')
var wishlist = require('../controllers/wishlists.js')

module.exports = function(app){
	app.post('/search', function(req, res){
		// console.log('req.body in routes', req.body)
		aws.itemSearch(req, res);
	})

	app.get('/topSellers/:department', function (req, res){
		// console.log("From routes.js:", req.params)
		aws.topSellers(req, res);
	})

	app.get('/itemLookUp/:asin', function (req, res){
		// console.log("From routes.js:", req.params)
		aws.itemLookUp(req, res);
	})

	app.post('/user', function (req, res){
		// console.log('calling user controller in server side')
		users.create(req, res);
	})

	app.get('/getUsers', function (req, res){
		users.index(req, res);
	})

	app.post('/login', function (req, res){
		// console.log("Header X-CSRF token info:", req.header('X-CSRFToken'))
		console.log("req.body from login:", req.body)
		console.log("req.headers from login:", req.headers)
		console.log("req.session from login:", req.session)
		users.login(req, res);
	})

	app.post('/forgot', function (req, res, next){
		users.forgot(req, res, next);
	})

	app.get('/logout', function (req, res){
		console.log("req.body from logout:", req.body)
		console.log("req.headers from logout:", req.headers)
		console.log("req.session from logout:", req.session)
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
		// console.log(req.body)
		// console.log("In restrict function:", req.session)
		// console.log(req.params)
	  if (req.session.loggedIn && req.session.info && req.session.info.id == req.params.uid) {
			next();
	  } else {
			console.log(req.session)
			console.log('Access denied! Please log in again!')
	    // req.session.error = 'Access denied! Please log in first to access to your wishlist';
			// console.log("session info ID:", req.session.info.id)
			// console.log(typeof(req.session.info.id), typeof(req.params.uid))
			// console.log(req.params.uid, 'Access denied! Please log in first to access to your wishlist')
			// res.json({message: 'Access denied! Please log in first to access to your wishlist'})
	  }
	}
}
