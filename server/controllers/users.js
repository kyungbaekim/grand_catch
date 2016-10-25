var mongoose = require('mongoose');
// instantiate customer model
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var jwt = require('jsonwebtoken');
var consts = require('../config/constant.js');
var secret = consts.jwtTokenSecret;
var User = mongoose.model('User');
var Wishlist = mongoose.model('Wishlist');
var token;

module.exports = {
	index: function(req, res) {
    User.find({}, function(err, users){
      if(err){
        console.log(err);
      }
      else{
        res.json(users);
      }
    })
  },

	create: function (req, res){
		console.log('req.body', req.body)
		User.findOne({email: req.body.email}, function (err, user){
			//if user email exist, return false
			if(user) { res.json({status: false, dup_email: ["Entered email address already exists!"]}) }
			else {
				if(req.body.password == req.body.cpassword){
					//save user info
					var user = new User({
						fname: req.body.fname,
						lname: req.body.lname,
						email: req.body.email,
						password: req.body.password
					})
					user.save(function(err){
						//save user, if errors push them to errors array
						if(err){
							var errors = [];
							for (var i in err.errors){
								errors.push(err.errors[i].message)
							}
							res.json({status: false, errors: errors})
						}else{
							//user saved successfully, set web token
							token = jwt.sign({
								email: user.email,
								password: user.password
							}, secret, { expiresIn: 60 * 60 * 12 });
							console.log({token: token})
							//user saved successfully, set session info
							req.session.info = {
								id: user._id,
								name: user.fname + " " + user.lname,
								token: token
							}
							req.session.loggedIn = true;
							var hour = 3600000 * 12 // 12 hours
							req.session.cookie.expires = new Date(Date.now() + hour)
							req.session.cookie.maxAge = hour
							// password matched, return login status true
							console.log("session info:", req.session)
							console.log("session id:", req.session.id)
							res.json({status: true, loggedIn: true, user: user})
						}//end of user save
					})
				} //end of password validation
			}
		})
	},

	login: function (req, res){
		console.log('login in server', req.body)
		if(req.body.email && req.body.password){
			User.findOne({email: req.body.email}, function (err, user){
				if(user){ // if user found
					if(user.validPassword(req.body.password)){
						// password matched, set web token
						token = jwt.sign({
							email: user.email,
							password: user.password
						}, secret, { expiresIn: 60 * 60 * 12 });
						console.log({token: token})
						// password matched, set session info
						req.session.info = {
							id: user._id,
							name: user.fname + " " + user.lname,
							token: token
						}
						req.session.loggedIn = true;
						var hour = 3600000 * 12 // 12 hours
						req.session.cookie.expires = new Date(Date.now() + hour)
						req.session.cookie.maxAge = hour
						// password matched, return login status true
						console.log("session info:", req.session)
						console.log("session id:", req.session.id)
						res.json({status: true, loggedIn: true, user: user})
					} else {
						// password does not match
						req.session.error = 'Authentication failed, please check your entered email address and password';
						res.json({status: false, errors: ["Invalid Email address and/or Password"]})
					}
				}
				else { // user not found
					req.session.error = 'Authentication failed, please check your entered email address and password';
					res.json({status: false, errors: ["Invalid Email address and/or Password"]})
				}
			})
		} else { // email or password is empty
			req.session.error = 'Authentication failed, please check your entered email address and password';
			res.json({status: false, errors: ["Invalid Email address and/or Password"]})
		}
	},

	forgot: function (req,res,next){
		console.log('forgot body', req.body);
		

		User.findOne({email:req.body.email}, function(err,user){
			if(user){
				console.log('user found', user)
			}else {
				req.session.error = 'Authentication failed, please check your entered email address';
				res.json({status: false, errors: ["Invalid Email address"]})
			}
		});
	},

	find: function(req, res) {
    User.find({_id: req.params.id}).deepPopulate('_wishlist').exec(function(err, user){
      if(err){
        res.json(err);
      }
      else {
        res.json(user);
      }
    })
  },

	getSession: function(req, res){
		if(req.session.info){
			res.json({sessionID: req.session.id, loggedIn: true, user: req.session.info})
		}
		else{
			res.json({sessionID: req.session.id})
		}
	},

	logout: function(req, res){
		req.session.destroy(function(err){
		  // cannot access session here
			if(!err){
				res.json({status: true, loggedIn: false, message: "Successfully logged out."})
			}
		})
	}
}
