myAppModule.controller('wishlistController', function ($scope, userFactory, wishlistFactory, $rootScope, $location){
  // console.log($routeParams.user_id, $rootScope.sessionUser.user_id)
  $scope.isArray = angular.isArray;

  $scope.$watch('$root.sessionUser', function() {
    // console.log($rootScope.sessionUser)
    if(!$rootScope.sessionUser.loggedIn){
      $location.path('/');
    }
  });

  wishlistFactory.getUserWishlist($routeParams.user_id, function (data){
    console.log(data)
    $rootScope.wishlist = data
    for(var i=0; i<$rootScope.wishlist.length; i++){
      if($rootScope.wishlist[i].product_detail[0].Title != undefined){
        $rootScope.wishlist[i].product_detail[0]['keywords'] = $rootScope.wishlist[i].product_detail[0].Title.replace(/[&\\#+$~%'":*?<>{}]/g,'')
      }
      else{
        $rootScope.wishlist[i].product_detail[0]['keywords'] = $rootScope.wishlist[i].product_detail[0].title.replace(/[&\\#+$~%'":*?<>{}]/g,'')
      }
      $rootScope.wishlist[i].product_detail[0]['keywords'] = $rootScope.wishlist[i].product_detail[0]['keywords'].replace(/\//g,'-')
    }
  })

  $scope.removeFromWishlist = function(wid, data){
    // console.log(wid)
    wishlistFactory.removeFromWishlist(wid, $routeParams.user_id, function(data){
      // console.log(data)
      $rootScope.wishlist = data;
    });
  }

  $scope.goBack = function() {
    window.history.back();
  };
});
