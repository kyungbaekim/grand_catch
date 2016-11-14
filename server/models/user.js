var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	fname: {type: String, required: [true, 'First name cannot be blank'], minlength: [3, 'First name is too short'], maxlength: [20, 'First name is too long']},
	lname: {type: String, required: [true, 'Last name cannot be blank'], minlength: [2, 'Last name is too short'], maxlength: [20, 'Last name is too long']},
	email: {type: String, required: [true, 'Email cannot be blank'], unique: true},
	password: {type: String, required: [true, 'Password cannot be blank'], minlength: [8, 'Password is too short']},
	wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist'}],
	resetPasswordToken: String,
	resetPasswordExpires: Date
}, {timestamps: true})

// define the schema for our user model
// var UserSchema = new mongoose.Schema({
//     local            : {
// 			fname        : String,
// 			lname        : String,
//       email        : String,
//       password     : String,
// 			wishlist     : [{type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist'}],
// 			resetPasswordToken: String,
// 			resetPasswordExpires: Date
//     },
//     facebook         : {
//       id           : String,
//       token        : String,
//       email        : String,
//       name         : String,
// 			wishlist     : [{type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist'}],
//     },
//     twitter          : {
//       id           : String,
//       token        : String,
//       displayName  : String,
//       username     : String,
// 			wishlist     : [{type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist'}],
//     },
//     google           : {
//       id           : String,
//       token        : String,
//       email        : String,
//       name         : String,
// 			wishlist     : [{type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist'}],
//     }
// }, {timestamps: true});

UserSchema.pre('save', function (done){
	var user = this;
  if(user.password){
		bcrypt.genSalt(10, function (err, salt){
			// console.log(salt, "salt in pre save function")
			bcrypt.hash(user.password, salt, function (err, hash){
				// console.log(hash, 'hash in pre save')
				user.password = hash
				done()
			});
		});
	}
});

UserSchema.methods.validPassword = function (password){
	return bcrypt.compareSync(password, this.password)
}

var deepPopulate = require('mongoose-deep-populate')(mongoose);
UserSchema.plugin(deepPopulate);
mongoose.model('User', UserSchema)
