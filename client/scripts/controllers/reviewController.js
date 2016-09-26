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

  $scope.getReviewURL = function(id,url){
    console.log('in getReviewURL', url)
    // http://www.amazon.com/Samsung-N920C-Factory-Unlocked-Galaxy/dp/*
    var pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(/:product)(/*)');
    var amazonUrl = pattern.match(url);
    // console.log('test url', amazonUrl)
    var refUrl = 'ref=cm_cr_if_acr_cm_cr_acr_txt?ie=UTF8&linkCode=xm2&showViewpoints=1&tag=smartercost-20'
 
    $scope.amazonReview = 'https://www.amazon.com/' + amazonUrl.product + '/product-reviews/' + id + '/' + refUrl

    console.log('amazonReview', $scope.amazonReview)
  }

})
    
