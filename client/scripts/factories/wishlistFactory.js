myAppModule.factory('wishlistFactory', function ($http){
	var users = [];
	var factory = {};

	factory.getUserWishlist = function(uid, callback){
		$http.get('/getUserWishlist/' + uid).success(function (res){
			// console.log(res)
			callback(res)
		})
	}

	factory.addToWishlist = function(item, uid, callback){
		console.log('data to save to wishlist', item, uid)
		// data = {item: item, uid: uid}
		$http.post('/addToWishlist/' + uid.uid, item).success(function (output){
      // console.log(output)
			callback(output)
		});
	}

	factory.removeFromWishlist = function(wid, uid, callback){
		$http.post('/wishlist/delete/' + wid + '/' + uid).success(function(res) {
			console.log(res)
      $http.get('/getUserWishlist/' + uid).success(function(data) {
        console.log(data)
        callback(data);
      })
    })
	}

	return factory;
})
