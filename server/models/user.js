var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	fname: {type: String, required: [true, 'First name cannot be blank']},
	lname: {type: String, required: [true, 'Last name cannot be blank']},
	email: {type: String, required: [true, 'Email cannot be blank'], unique: true},
	password: {type: String, required: [true, 'Password cannot be blank']},
	wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist'}]
}, {timestamps: true})

UserSchema.pre('save', function (done){
	var user = this;
	console.log('user.password in UserSchema', user.password)
	if(user.password){
		bcrypt.genSalt(10, function (err, salt){
			console.log(salt, "salt in pre save function")
			bcrypt.hash(user.password, salt, function (err, hash){
				console.log(hash, 'hash in pre save')
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
