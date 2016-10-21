myAppModule.controller('topSingleItemController', function ($scope, itemsFactory, $timeout){
  var MAX_REQUESTS = 5;
  var counter = 0;

  if($scope.item){
    // console.log($scope.item.ASIN)
    var getItem = function(){
      itemsFactory.itemLookUp($scope.item.ASIN, function(res){
        // console.log(res)
        if(res.result.Error && counter < MAX_REQUESTS){
          console.log('error occurred', counter)
          $timeout(function(){getItem()}, 1000);
          counter++;
        }
        if(res.result != undefined && res.result.Items != undefined){
          $scope.itemDetail = res.result.Items.Item
        }
      })
    }
    getItem()
  }

  if($scope.eItem){
    // console.log($scope.eItem.productId['@type'], $scope.eItem.productId['__value__'])
    itemsFactory.getEbaySingleItem($scope.eItem.itemId, function(data){
      $scope.eItemDetail = data.Item;
      // console.log($scope.eItemDetail)
    })
  }

  if($scope.deal){
    // console.log($scope.eItem.productId['@type'], $scope.eItem.productId['__value__'])
    itemsFactory.getEbaySingleItem($scope.deal.ItemId, function(data){
      $scope.dealDetail = data.Item;
      // console.log($scope.dealDetail)
    })
  }
})
