myAppModule.controller('usersController', function ($scope, $rootScope, userFactory, wishlistFactory, $uibModal, $uibModalStack, $location, $cookies, Idle, Keepalive){
	$scope.$parent.seo = {
    pageTitle : 'GrandCatch user page',
    pageDescripton: 'Please register/login to use our wishlist service.'
  };

	$('#search_keywords').focus();
	$scope.started = false;

	userFactory.getSession(function(data){
		$rootScope.sessionUser = data;
		// console.log(data)
	});

	// userFactory.getAllUser(function(data){
	// 	console.log("All users:", data);
	// })

	$scope.searchKey = function(){
		console.log("Searched keyword:", $scope.search.keywords)
		$scope.search.keywords = $scope.search.keywords.replace(/[&\\#+$~%'":*?<>{}]/g,'')
		$scope.search.keywords = $scope.search.keywords.replace(/\//g,'')
		$location.url('search/' + $scope.search.keywords)
		$scope.search = {};
		$('#search_keywords').focus();
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
			// console.log(data)
			userFactory.getSession(function(data){
				// console.log("User data returned: ", data)
				$rootScope.sessionUser = data;
				// console.log('current sessionUser', $rootScope.sessionUser)
				Idle.watch();
				$scope.started = true;
			});
    }, function () {
        console.log('Modal dismissed at: ' + new Date());
    });
	};

	var RegModalInstanceCtrl = function ($uibModalInstance, userForm, $scope) {
    $scope.register = function () {
			userFactory.newUser($scope.user, function(data){
				if(data.status){
					// console.log(data.user)
					$uibModalInstance.close(data.user)
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
		//console.log($scope.message);

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
			// console.log(data)
			userFactory.getSession(function(data){
				$rootScope.sessionUser = data;
			//console.log('current sessionUser', $rootScope.sessionUser)
				Idle.watch();
				$scope.started = true;
			});
		}, function () {
			//console.log('Modal dismissed at: ' + new Date());
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

		//open a Forgot Modal instance
		$scope.forgot = function () {
			//close previous modal
			$uibModalStack.dismissAll('closed');
			$scope.message = "Forgot Button Clicked";
			//console.log($scope.message);

			var modalInstance = $uibModal.open({
				templateUrl: 'partials/forgotPW.html',
				controller: ForgotModalInstanceCtrl
			});
			modalInstance.result.then(function (data) {
				//console.log(data)
				userFactory.getSession(function(data){
					$rootScope.sessionUser = data;
					console.log('current sessionUser', $rootScope.sessionUser)
				});
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		}
	}; //end of LoginModalInstanceCtrl

	var ForgotModalInstanceCtrl = function ($uibModalInstance, $scope) {

		$scope.message = "Forgot instance Button Clicked";
		console.log($scope.message);

		$scope.recover = function () {
			// console.log("userForm data:", $scope.user)
			userFactory.forgot($scope.user, function(data){
				console.log('forgot response', data.status)
				if(data.status){
					$uibModalInstance.close()
					//open verify PW modal instance
					var modalInstance = $uibModal.open({
						templateUrl: 'partials/verifyPW.html',
						controller: VerifyPwModalInstanceCtrl,
						resolve: {
							//pass forgotEmailForm to VerifyPwModalInstanceCtrl
							forgotEmailForm: function () {
								return $scope.forgotEmailForm;
							}
						}
					});
				}
				else{
					$scope.forgot_errors = data.errors;
					console.log('forgot errors', $scope.forgot_errors)
				}
			});
		};

		$scope.cancel = function () {
			console.log("Cancel button clicked")
			$uibModalStack.dismissAll('closed');
		};
	}; //end of ForgotModalInstanceCtrl

	var VerifyPwModalInstanceCtrl = function($uibModalInstance, forgotEmailForm,$scope) {
		console.log('forgotEmailForm', forgotEmailForm.email.$$rawModelValue)
		$scope.forgotEmail = forgotEmailForm.email.$$rawModelValue;

		$scope.verifyCode = function(){
			$scope.verify.email = $scope.forgotEmail
			userFactory.verify($scope.verify, function(data){
				console.log('verify', data)
				if(data.status){
					$uibModalInstance.close()
					console.log('open reset password modal')
					var modalInstance = $uibModal.open({
						templateUrl: 'partials/resetPw.html',
						controller: ResetPwModalInstanceCtrl
					});
				}else {
					$scope.verify_errors = data.errors;
				}
			})
		}

		$scope.cancel = function () {
			console.log("Cancel button clicked")
			$uibModalStack.dismissAll('closed');
		};
	} //end of VerifyPwModalInstanceCtrl

	var ResetPwModalInstanceCtrl = function($uibModalInstance,$scope) {
		$scope.resetPW = function(){
			userFactory.resetPW($scope.user, function(data){
				console.log('reset', data)
				if(data.status){
					$uibModalInstance.close()
					userFactory.getSession(function(data){
						$rootScope.sessionUser = data;
						console.log('current sessionUser', $rootScope.sessionUser)
					});
				}else {
					$scope.reset_errors = data.errors;
				}
			})
		}

		$scope.cancel = function () {
			console.log("Cancel button clicked")
			$uibModalStack.dismissAll('closed');
		};
	} //end of ResetPwPwModalInstanceCtrl

	$scope.logout = function (){
		console.log("Logging out!")
		userFactory.logout();
		$rootScope.wishlist = []
		$scope.getSession();
		Idle.unwatch();
		$scope.started = false;
	}

	function closeModals() {
    if ($scope.warning) {
      $scope.warning.close();
      $scope.warning = null;
    }

    if ($scope.timedout) {
      $scope.timedout.close();
      $scope.timedout = null;
    }
  }

  $scope.$on('IdleStart', function() {
    closeModals();
    $scope.warning = $uibModal.open({
      templateUrl: 'warning-dialog.html',
      windowClass: 'modal-danger'
    });
  });

  $scope.$on('IdleEnd', function() {
    closeModals();
  });

  $scope.$on('IdleTimeout', function() {
    closeModals();
    $scope.timedout = $uibModal.open({
      templateUrl: 'timedout-dialog.html',
      windowClass: 'modal-danger'
    });
		console.log('Timeout occurred!')
		$scope.logout();
  });
});
