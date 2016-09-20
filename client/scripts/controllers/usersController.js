myAppModule.controller('usersController', function ($scope, userFactory, $uibModal){
	userFactory.getSession(function(data){
		$scope.sessionUser = data;
		console.log('latest sessionUser', $scope.sessionUser)
	});

	userFactory.getAllUser(function(data){
		console.log("All users:", data);
	})

	$scope.getSession = function(){
		userFactory.getSession(function(data){
			$scope.sessionUser = data;
			console.log('latest sessionUser', $scope.sessionUser)
		});
	}

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
        $scope.sessionUser = data;
    }, function () {
        console.log('Modal dismissed at: ' + new Date());
    });
	};

	var RegModalInstanceCtrl = function ($uibModalInstance, userForm, $scope) {
    $scope.register = function () {
			userFactory.newUser($scope.user, function(data){
				console.log('returned data user created', data)
				if(data.status){
					userFactory.getSession(function(data){
						$uibModalInstance.close(data)
					})
				}
				else{
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
			$uibModalInstance.dismiss('cancel');
		};
	};

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
			$scope.sessionUser = data;
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	var LoginModalInstanceCtrl = function ($uibModalInstance, userForm, $scope) {
		$scope.login = function () {
			userFactory.login($scope.user, function(data){
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
			$uibModalInstance.dismiss('cancel');
		};
	};

	$scope.logout = function (){
		userFactory.logout();
		$scope.getSession();
	}
});
