myAppModule.controller('reviewController', function ($scope, itemsFactory){
  // console.log('reviewController', $scope.item)
  //check if scope.item is available
  if($scope.item){
    //call getReview if seller is Amazon
    if($scope.item.seller == 'amazon'){
      getReview();
    }

    function getReview (){
      var reviewURL = $scope.item.CustomerReviews.IFrameURL
      itemsFactory.reviewLookUp(reviewURL, function(data){
        // console.log('reviewLookUp data', data)
        $scope.review = data;
      })
    }
  }
})
    
