myAppModule.factory('wishlistFactory', function ($http){
	var users = [];
	var factory = {};

	factory.getAllWishlist = function(callback){
		$http.get('/getWishlist').success(function(output){
			wishlist = output;
			callback(wishlist);
		})
	}

	factory.addToWishlist = function(data, callback){
		console.log('data to save to wishlist', data)
		$http.post('/addToWishlist', data).success(function (output){
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
