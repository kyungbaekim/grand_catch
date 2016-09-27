myAppModule.controller('reviewController', function ($scope, itemsFactory){
  // check if scope.item is available
  if($scope.item){
    // call getReview if seller is Amazon
    if($scope.item.seller == 'amazon'){
      getAmazonReview();
    }
    else if($scope.item.seller == 'ebay'){
      getEbayReview();
    }

    function getAmazonReview (){
      var reviewURL = $scope.item.CustomerReviews.IFrameURL
      itemsFactory.amazonReviewLookUp(reviewURL, function(data){
        $scope.amazonReview = data;
      })
    }

    function getEbayReview (){
      itemsFactory.getEbaySingleItem($scope.item.id, function(data){
        // console.log('reviewLookUp data', data.Item)
        $scope.itemDetail = data.Item;
        itemsFactory.ebayReviewLookUp(data.Item.ViewItemURLForNaturalSearch, function(res){
          $scope.reviewURL = data.Item.ViewItemURLForNaturalSearch + '#rwid'
          $scope.ebayReview = res
        })
      })
    }
  }

  $scope.getReviewURL = function(id,url){
    // console.log('in getReviewURL', url)
    var pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(/:product)(/*)');
    var amazonUrl = pattern.match(url);
    var refUrl = 'ref=cm_cr_if_acr_cm_cr_acr_txt?ie=UTF8&linkCode=xm2&showViewpoints=1&tag=smartercost-20'
    $scope.amazonReviewURL = 'https://www.amazon.com/' + amazonUrl.product + '/product-reviews/' + id + '/' + refUrl
    // console.log('amazonReview', $scope.amazonReview)
  }
})

myAppModule.directive("averageStarRating", function() {
  return {
    restrict : "EA",
    template : "<div class='average-rating-container'>" +
               "  <ul class='rating background' class='readonly'>" +
               "    <li ng-repeat='star in stars' class='star'>" +
               "      <i class='fa fa-star'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "  <ul class='rating foreground' class='readonly' style='width:{{filledInStarsContainerWidth}}%'>" +
               "    <li ng-repeat='star in stars' class='star filled'>" +
               "      <i class='fa fa-star'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "</div>",
    scope : {
      averageRatingValue : "=ngModel",
      max : "=?", //optional: default is 5
    },
    link : function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({});
        }
        var starContainerMaxWidth = 100; //%
        scope.filledInStarsContainerWidth = scope.averageRatingValue / scope.max * starContainerMaxWidth;
      };
      scope.$watch("averageRatingValue", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
});
