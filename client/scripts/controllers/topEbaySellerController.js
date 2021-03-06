myAppModule.controller('topEbaySellerController', function ($scope, itemsFactory){
  // console.log($scope.department);

  var department = ''
  if($scope.department == 'e_home_garden'){
    department = '20710'
  }
  else if($scope.department == 'e_phones_accessories'){
    department = '15032'
  }
  else if($scope.department == 'e_fashion'){
    department = '11450'
  }
  else if($scope.department == 'e_computers'){
    department = '58058'
  }
  else if($scope.department == 'e_electronics'){
    department = '15032'
  }
  else if($scope.department == 'e_office_product'){
    department = '1084128'
  }
  else if($scope.department == 'e_health_beauty'){
    department = '26395'
  }
  else if($scope.department == 'e_jewelry_watches'){
    department = '281'
  }
  else if($scope.department == 'e_sporting_goods'){
    department = '888'
  }
  else if($scope.department == 'e_baby'){
    department = '2984'
  }
  else if($scope.department == 'e_toys_hobbies'){
    department = '220'
  }

  var MAX_REQUESTS = 5;
  var counter = 0;
  var getItems = function(){
    itemsFactory.getPopularEbayItems(department, function(res){
      // console.log(res)
      if(res.error && counter < MAX_REQUESTS){
        console.log('error occurred', counter)
        $timeout(function(){
          getItems()
        }, 1000);
        // getItems();
        counter++;
      }
      $scope.ebayItems = res.getMostWatchedItemsResponse.itemRecommendations.item
      for(var i=0; i<$scope.ebayItems.length; i++){
        $scope.ebayItems[i]['keywords'] = $scope.ebayItems[i].title.replace(/[&\\#+$~%'":*?<>{}]/g,'')
        $scope.ebayItems[i]['keywords'] = $scope.ebayItems[i]['keywords'].replace(/\//g,'-')
        // $scope.ebayItems[i].viewItemURL[0] + '&affiliate.trackingId=' + affiliateTrackingId + '&affiliate.networkId=' + affiliateNetworkId + '&affiliate.customId=' + affiliateCustomId;
      }
      // console.log($scope.ebayItems)
    })
  }

  getItems();
})
