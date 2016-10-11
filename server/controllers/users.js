var mongoose = require('mongoose');
// instantiate customer model
// var deepPopulate = require('mongoose-deep-populate')(mongoose);
var User = mongoose.model('User');
var sessionUser = {loggedIn: false};

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

	create : function (req, res){
		console.log('req.body', req.body)
		User.findOne({email: req.body.email}, function (err, user){
			console.log('user in registration', user)
			console.log('error in registration', err)
			//if user email exist, return false
			if(user) { res.json({status: false, dup_email: ["Email already exist"]}) }
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
							//user saved successfully, set session info
							sessionUser = {
								loggedIn: true,
								user_id: user._id,
								user_name: user.fname + " " + user.lname,
								email: user.email
							}
							res.json({status: true, sessionUser: sessionUser})
						}//end of user save
					})
				} //end of password validation
			}
		})
	},

	login : function (req,res){
		console.log('login in server', req.body)
		if(req.body.email && req.body.password){
			User.findOne({email: req.body.email}, function (err, user){
				if(user){ // if user found
					console.log("User found:", user)
					// user.validPassword(req.body.password, function(res){
						console.log(req.body.password, user.validPassword(req.body.password))
					// })
					if(user.validPassword(req.body.password)){
						sessionUser = {
							loggedIn: true,
							user_id: user._id,
							user_name: user.fname + " " + user.lname,
							email: user.email
						}
						//password matched, return login status true
						console.log(sessionUser, user)
						res.json({status:true, sessionUser: sessionUser})
					} else {
						res.json({status: false, errors: ["Incorrect Email or Password"]})
					}
				}
				else { //user not found
					res.json({status: false, errors: ["Incorrect Email or Password"]})
				}
			})
		} else { //email or password is empty
			res.json({status: false, errors: ["Incorrect Email or Password"]})
		}
	},

	getSession : function(req,res){
		res.json(sessionUser);
	},

	logout : function(req,res){
		sessionUser = {loggedIn: false}
		res.json({status: true, sessionUser : sessionUser})
	}
}
