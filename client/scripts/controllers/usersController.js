myAppModule.controller('usersController', function ($scope, userFactory, wishlistFactory, $uibModal, $uibModalStack, $rootScope){
	$rootScope.wishlist = []

	userFactory.getSession(function(data){
		$rootScope.sessionUser = data;
		console.log('current sessionUser', $rootScope.sessionUser)
	});

	userFactory.getAllUser(function(data){
		console.log("All users:", data);
	})

	$scope.getSession = function(){
		userFactory.getSession(function(data){
			$rootScope.sessionUser = data;
			console.log('current sessionUser data:', $rootScope.sessionUser)
		});
	}

	$rootScope.$on("CallRegister", function(){
    $scope.register();
  });

	$scope.register = function () {
    $scope.message = "Register Button Clicked";
    console.log($scope.message);

    var modalInstance = $uibModal.open({
      templateUrl: 'partials/signup.html',
      controller: RegModalInstanceCtrl,
      resolve: {
        userForm: function () {
          return $scope.regForm;
        }
      }
    });

    modalInstance.result.then(function (data) {
			console.log(data)
      $rootScope.sessionUser = data;
			wishlistFactory.getSession(function(data){
				$rootScope.sessionUser = data;
				console.log('current sessionUser data:', $rootScope.sessionUser)
			});
    }, function () {
        console.log('Modal dismissed at: ' + new Date());
    });
	};

	var RegModalInstanceCtrl = function ($uibModalInstance, userForm, $scope) {
    $scope.register = function () {
			userFactory.newUser($scope.user, function(data){
				console.log('returned data user created:', data)
				if(data.status){
					console.log("data.status is true")
					userFactory.getSession(function(data){
						console.log(data)
						$uibModalInstance.close(data)
					})
				}
				else{
					console.log("data.status is not true")
					if(data.dup_email){
						$scope.register_email_error = data.dup_email;
						console.log('register email error', $scope.register_email_error)
					}
					if(data.errors){
						$scope.register_error = data.errors;
						console.log('register errors', $scope.register_errors)
					}
				}
			});
    };
		$scope.cancel = function () {
			console.log("Cancel button clicked")
			// $uibModalInstance.dismiss('cancel');
			$uibModalStack.dismissAll('closed');
		};
	};

	$rootScope.$on("CallLogin", function(){
  	$scope.login();
  });

	$scope.login = function () {
		$scope.message = "Login Button Clicked";
		console.log($scope.message);

		var modalInstance = $uibModal.open({
			templateUrl: 'partials/login.html',
			controller: LoginModalInstanceCtrl,
			resolve: {
        userForm: function () {
          return $scope.loginForm;
        }
      }
		});

		modalInstance.result.then(function (data) {
			console.log(data)
			$rootScope.sessionUser = data;
			wishlistFactory.getUserWishlist($rootScope.sessionUser.user_id, function (res){
				console.log(res)
				$rootScope.wishlist = res
			})
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	var LoginModalInstanceCtrl = function ($uibModalInstance, userForm, $scope) {
		$scope.login = function () {
			userFactory.login($scope.user, function(data){
				// console.log('returned user data:', data)
				if(data.status){
					userFactory.getSession(function(data){
						$uibModalInstance.close(data)
					})
				}
				else{
					console.log('login errors', data.errors)
					$scope.login_errors = data.errors;
					console.log('login errors', $scope.login_errors)
				}
			});
		};

		$scope.cancel = function () {
			console.log("Cancel button clicked")
			// $uibModalInstance.dismiss('cancel');
			$uibModalStack.dismissAll('closed');
		};
	};

	$scope.logout = function (){
		userFactory.logout();
		$scope.getSession();
		$rootScope.wishlist = []
	}
});
