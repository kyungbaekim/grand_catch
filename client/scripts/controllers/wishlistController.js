myAppModule.controller('wishlistController', function ($scope, userFactory, wishlistFactory, $rootScope, $routeParams, $location){
  // console.log($routeParams.user_id, $rootScope.sessionUser.user_id)

  $scope.$watch('$root.sessionUser', function() {
    // console.log($rootScope.sessionUser)
    if(!$rootScope.sessionUser.loggedIn){
      $location.path('/');
    }
  });

  wishlistFactory.getUserWishlist($routeParams.user_id, function (data){
    console.log(data)
    $rootScope.wishlist = data
  })

  $scope.removeFromWishlist = function(wid, data){
    // console.log(wid)
    wishlistFactory.removeFromWishlist(wid, $routeParams.user_id, function(data){
      // console.log(data)
      $rootScope.wishlist = data;
    });
  }
});
