myAppModule.controller('topSingleItemController', function ($scope, itemsFactory, $routeParams){
  if($scope.item){
    // console.log($scope.item.ASIN)
    itemsFactory.itemLookUp($scope.item.ASIN, function(res){
      console.log(res)
      $scope.itemDetail = res.result.Items.Item
    })
  }

  if($scope.eItem){
    // console.log($scope.eItem.productId['@type'], $scope.eItem.productId['__value__'])
    itemsFactory.getEbaySingleItem($scope.eItem.itemId, function(data){
      $scope.eItemDetail = data.Item;
      console.log($scope.eItemDetail)
    })
  }
})
