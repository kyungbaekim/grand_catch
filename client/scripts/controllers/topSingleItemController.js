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
    // itemsFactory.getPopularEbaySingleItem($scope.eItem.productId['__value__'], function(res){
    //   $scope.eItemDetail = res.findItemsByProductResponse[0].searchResult[0]
    //   console.log($scope.eItemDetail)
    // })
  }
})
