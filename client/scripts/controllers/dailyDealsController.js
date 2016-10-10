myAppModule.controller('dailyDealsController', function ($scope, itemsFactory){
  $scope.currentPage = 1;
  $scope.pageSize = 10;

  itemsFactory.getEbayDailyDeals(function(deals){
    $scope.deals = deals.entry
    // console.log($scope.deals)
    for(var i=0; i<$scope.deals.length; i++){
      $scope.deals[i]['keywords'] = $scope.deals[i].title.replace(/[&\\#+$~%'":*?<>{}]/g,'')
      $scope.deals[i]['keywords'] = $scope.deals[i]['keywords'].replace(/\//g,'-')
    }
    console.log($scope.deals)
	})
})
