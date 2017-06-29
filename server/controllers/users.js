var mongoose = require('mongoose');
// instantiate customer model
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var sanitize = require('mongo-sanitize');
var jwt = require('jsonwebtoken');
var consts = require('../config/constant.js');
var secret = consts.jwtTokenSecret;
var User = mongoose.model('User');
var Wishlist = mongoose.model('Wishlist');
var token;
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var asyncJS = require('async');
var expirationTime = 3600000;

module.exports = {
	index: function(req, res) {
    User.find({}, function(err, users){
      if(err){
        console.log(err);
      }
      else{
				// console.log('in users controller', users);
        res.json(users);
      }
    })
  },

	create: function (req, res){
		// console.log('req.body', req.body)
		var fname = sanitize(req.body.fname);
		var lname = sanitize(req.body.lname);
		var email = sanitize(req.body.email);
		var password = sanitize(req.body.password);
		var cpassword = sanitize(req.body.cpassword);
		User.findOne({email: email}, function (err, user){
			//if user email exist, return false
			if(user) { res.json({status: false, dup_email: ["Entered email address already exists!"]}) }
			else {
				if(password == cpassword){
					//save user info
					var user = new User({
						fname: fname,
						lname: lname,
						email: email,
						password: password
					})
					user.save(function(err){
						//save user, if errors push them to errors array
						if(err){
							var errors = [];
							for (var i in err.errors){
								errors.push(err.errors[i].message)
							}
							res.json({status: false, errors: errors})
						}else {
							//user saved successfully, set web token
							token = jwt.sign({
								email: user.email,
								password: user.password
							}, secret, { expiresIn: 60 * 60 * 12 });
							// console.log({token: token})
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
							res.json({status: true, loggedIn: true, user: user._id})
						}//end of user save
					})
				} //end of password validation
			}
		})
	},

	login: function (req, res){
		console.log('login in server', req.body)
		var email = sanitize(req.body.email);
		var password = sanitize(req.body.password);
		if(email && password){
			User.findOne({email: email}, function (err, user){
				if(user){ // if user found
					if(user.validPassword(password)){
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
						res.json({status: true, loggedIn: true, user: user._id})
					} else {
						// password does not match
						req.session.error = 'Authentication failed, please check your entered email address and password';
						res.json({status: false, errors: ["Invalid Email address and/or password"]})
					}
				}
				else { // user not found
					req.session.error = 'Authentication failed, please check your entered email address and password';
					res.json({status: false, errors: ["Invalid Email address and/or password"]})
				}
			})
		} else { // email or password is empty
			req.session.error = 'Authentication failed, please check your entered email address and password';
			res.json({status: false, errors: ["Invalid Email address and/or assword"]})
		}
	},

	forgot: function (req,res,next){
		console.log('forgot body', req.body);
			asyncJS.waterfall([
	    function(done) {
	      crypto.randomBytes(5, function(err, buf) {
					//generate a random token
	        var token = buf.toString('hex');
	        done(err, token);
	      });
	    },
	    function(token, done) {
				var email = sanitize(req.body.email);
	      User.findOne({ email: email }, function(err, user) {
	        if (!user) {
						req.session.error = 'Authentication failed, please check your entered email address';
						res.json({status: false, errors: ["Invalid Email address"]})
	          // return res.redirect('/forgot');
	        }
					else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + expirationTime; // 1 hour
						//save token info to user
						user.save(function(err) {
							done(err, token, user);
						});
					}

	      });
	    },
	    function(token, user, done) {
				// create reusable transporter object using the default SMTP transport
				var smtpTransport = nodemailer.createTransport('smtps://pokemongomapper%40gmail.com:pikachu1@smtp.gmail.com');
	      var mailOptions = {
					// console.log('in mailOptions', req.headers.host);
	        to: user.email,
	        from: 'pokemongomapper@gmail.com',
	        subject: 'Grand Catch Password Reset',
	        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	          'To finish verifying your email with Grand Catch, please enter the following security code:\n\n' +
	          token + '\n\n' +
	          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	      };
	      smtpTransport.sendMail(mailOptions, function(err, info) {
					console.log('An e-mail has been sent to ' + user.email + ' with further instructions.');
					console.log('Message sent: ' + info.response);
	        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
					if(err){
						res.json({status: false, errors: ['Email could not be sent. Please wait a few minutes a try again']});
					} else {
						res.json({status: true});
					}
	      });
	    }
	  ]);
	},

	verify: function(req, res) {
		var email = sanitize(req.body.email);
		var code = sanitize(req.body.code);
		console.log('in verify server', email)
		User.findOne({email: email}, function(err, user){
			console.log('user found', user)
			//checks if time pass is greater than 1 hr
			if(user.resetPasswordExpires - Date.now() > expirationTime){
				res.json({status: false, errors: ['Verification code has expired. Please submit a new code.']})
			}else if (user.resetPasswordToken != code) {
				console.log('verification code doest not match')
				res.json({status: false, errors: ['Verification code does not match. Please check your code and try again.']})
			}else {
				// verification code matched, set web token
				console.log('verification code matches')
				token = jwt.sign({
					email: user.email
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
				res.json({status: true, loggedIn: true, user: user._id})
			}
		})
	},

	reset: function(req, res) {
		console.log('in reset server controller', req.body);
		var user_id = sanitize(req.body.user_id);
		var user_pw = sanitize(req.body.password);
		var user_cpw = sanitize(req.body.cpassword);
		if(user_pw == user_cpw ){
			User.findOne({_id: user_id}, function(err,user) {
				if(user) {
					user.password = user_pw;
					user.save(function(err, updatedUser) {
						if(err){
							console.log('error saving user');
						}else {
							console.log('user pw updated');
							res.json({status:true});
						}
					})
				}
				console.log('user found in reset',user)
			});
		}else {
			res.json({status:false}, {errors: ['Password and Confirmation Password does not match']})
		}
	},

	find: function(req, res) {
		var id = sanitize(req.params.id);
    User.find({_id: id}).deepPopulate('_wishlist').exec(function(err, user){
      if(err){
        res.json(err);
      }
      else {
        res.json(user);
      }
    })
  },

	getSession: function(req, res){
		console.log('get current session in server',req.session);
		if(req.session.info){
			res.json({sessionID: req.session.id, loggedIn: true, user: req.session.info})
		}
		else{
			res.json({sessionID: req.session.id})
		}
	},

	logout: function(req, res){
		// req.logout();
		req.session.destroy(function(err){
		  // cannot access session here
			if(!err){
				res.json({status: true, loggedIn: false, message: "Successfully logged out."})
			}
		})
	}
}
