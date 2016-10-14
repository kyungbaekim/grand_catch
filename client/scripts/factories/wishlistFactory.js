myAppModule.factory('wishlistFactory', function ($http){
	var users = [];
	var factory = {};

	factory.getUserWishlist = function(uid, callback){
		$http.get('/getUserWishlist/' + uid).success(function (res){
			// console.log(res)
			callback(res)
		})
	}

	factory.addToWishlist = function(data, callback){
		// console.log('data to save to wishlist', data)
		$http.post('/addToWishlist', data).success(function (output){
      // console.log(output)
			callback(output)
		});
	}

	factory.removeFromWishlist = function(){
		$http.get('/removeFromWishlist').success(function (output){
			// sessionUser = output;
		})
	}

	return factory;
})
