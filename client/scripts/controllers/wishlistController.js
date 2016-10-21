myAppModule.controller('wishlistController', function ($scope, userFactory, wishlistFactory, $rootScope, $routeParams, $location){
  console.log($rootScope.sessionUser, $routeParams.user_id)
  if($rootScope.sessionUser.user.info.id != $routeParams.user_id){
    window.history.back();
  }

  $scope.isArray = angular.isArray;

  $scope.$watch('$root.sessionUser', function() {
    if(!$rootScope.sessionUser.user.loggedIn){
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
    wishlistFactory.removeFromWishlist(wid, $routeParams.user_id, function(data){
      $rootScope.wishlist = data;
    });
  }

  $scope.goBack = function() {
    window.history.back();
  };
});
