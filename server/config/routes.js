//go back up 2 folders and to controllers routes
var users = require('../controllers/users.js')
var aws = require('../controllers/aws.js')
var wishlist = require('../controllers/wishlists.js')

module.exports = function(app){
	app.post('/search', function(req, res){
		console.log('req.body in routes', req.body)
		aws.itemSearch(req, res);
	})

	app.get('/topSellers/:department', function (req,res){
		console.log("From routes.js:", req.params)
		aws.topSellers(req, res);
	})

	app.get('/itemLookUp/:asin', function (req,res){
		console.log("From routes.js:", req.params)
		aws.itemLookUp(req, res);
	})

	app.post('/user', function (req, res){
		console.log('calling user controller in server side')
		users.create(req, res);
	})

	app.get('/getUsers', function (req, res){
		users.index(req, res);
	})

	app.post('/login', function (req, res){
		users.login(req, res);
	})

	app.get('/logout', function (req, res){
		users.logout(req, res)
	})

	app.get('/session_user', function (req,res){
		users.getSession(req, res);
	})

	app.post('/addToWishlist', function (req, res){
		wishlist.create(req, res)
	})

	app.get('/getUserWishlist/:uid', function (req, res){
		console.log("From routes.js:", req.params)
		wishlist.index(req, res)
	})
}
