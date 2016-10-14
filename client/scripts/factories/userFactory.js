myAppModule.factory('userFactory', function ($http){
	var users = [];
	var factory = {};
	var sessionUser = {loggedIn: false};

	factory.newUser = function (data, callback){
		// console.log("I am in factory")
		$http.post('/user', data).success(function (output){
			console.log('add new user output', output);
			//if status is true, set sessionUser
			if(output.status){
				sessionUser = output.sessionUser;
			}
			//run callback to pass data from factory to controller after getting http resp
			callback(output);
		})
	}

	factory.getAllUser = function(callback){
		$http.get('/getUsers').success(function(output){
			users = output;
			callback(users);
		})
	}

	factory.login = function(data, callback){
		// console.log('login data', data)
		$http.post('/login', data).success(function (output){
			if(output.status){
				sessionUser = output.sessionUser;
				// console.log('sessionUser in factory', sessionUser)
			}
			callback(output)
		});
	}

	factory.logout = function(){
		$http.get('/logout').success(function (output){
			sessionUser = output;
		})
	}

	factory.getSession = function(callback){
		//make full http get request to get the latest sessionUser status
		$http.get('/session_user').success(function (output){
			callback(output);
		})
	}

	return factory;
})
