myAppModule.controller('usersController', function ($scope, $rootScope, userFactory, wishlistFactory, $uibModal, $uibModalStack, $location, $cookies){
	// console.log($cookies['connect.sid'])

	userFactory.getSession(function(data){
		$rootScope.sessionUser = data;
		// console.log('current sessionUser', $rootScope.sessionUser)
		console.log(data)
	});

	userFactory.getAllUser(function(data){
		console.log("All users:", data);
	})

	$scope.searchKey = function(){
		console.log("Searched keyword:", $scope.search.keywords)
		$scope.search.keywords = $scope.search.keywords.replace(/[&\\#+$~%'":*?<>{}]/g,'')
		$scope.search.keywords = $scope.search.keywords.replace(/\//g,'')
		$location.url('search/' + $scope.search.keywords)
	}

	$scope.getSession = function(){
		userFactory.getSession(function(data){
			$rootScope.sessionUser = data;
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
			userFactory.getSession(function(data){
				$rootScope.sessionUser = data.sessionUser;
				console.log('current sessionUser', $rootScope.sessionUser)
			});
    }, function () {
        console.log('Modal dismissed at: ' + new Date());
    });
	};

	var RegModalInstanceCtrl = function ($uibModalInstance, userForm, $scope) {
    $scope.register = function () {
			userFactory.newUser($scope.user, function(data){
				if(data.status){
					$uibModalInstance.close(data.sessionUser)
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
			userFactory.getSession(function(data){
				$rootScope.sessionUser = data;
				console.log('current sessionUser', $rootScope.sessionUser)
			});
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	var LoginModalInstanceCtrl = function ($uibModalInstance, userForm, $scope) {
		$scope.login = function () {
			// console.log("userForm data:", $scope.user)
			userFactory.login($scope.user, function(data){
				if(data.status){
					$uibModalInstance.close(data.user)
				}
				else{
					$scope.login_errors = data.errors;
					console.log('login errors', $scope.login_errors)
				}
			});
		};

		$scope.cancel = function () {
			console.log("Cancel button clicked")
			$uibModalStack.dismissAll('closed');
		};
	};

	$scope.logout = function (){
		userFactory.logout();
		$rootScope.wishlist = []
		$scope.getSession();
	}
});
