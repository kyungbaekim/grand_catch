myAppModule.controller('topSingleItemController', function ($scope, itemsFactory){
  if($scope.item){
    // console.log($scope.item.ASIN)
    itemsFactory.itemLookUp($scope.item.ASIN, function(res){
      // console.log(res)
      if(res.result != undefined && res.result.Items != undefined){
        $scope.itemDetail = res.result.Items.Item
      }
    })
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
