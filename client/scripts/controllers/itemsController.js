myAppModule.controller('itemsController', function ($scope, itemsFactory, $uibModal, $interval, $routeParams){
	$scope.currentPage = 1;
  $scope.pageSize = 10;

	// boolean flag to indicate api call success
	$scope.dataLoaded = true;
	$scope.keywords = '';
	var temp = [];

	$scope.searchProduct = function (){
		$scope.dataLoaded = false;
		$scope.searchResult = [];
		$scope.conditions = {};
		$scope.searchTime = new Date();

		itemsFactory.getItems($scope.keywords, function(data){
			console.log(data);
			createEbayList(data[0])
			var temp = [];
			for(var i=0; i<data[1].length; i++){
				if(data[1][i] != null){
					temp = temp.concat(data[1][i])
				}
			}
			createAmazonList(temp)
			var i = 0;
			while(i < 10){
				if($scope.searchAmazonResult[0] != undefined){
					$scope.searchResult.push($scope.searchAmazonResult[0]);
				}
				if($scope.searchEbayResult[0] != undefined){
					$scope.searchResult.push($scope.searchEbayResult[0]);
				}
				$scope.searchAmazonResult.shift();
				$scope.searchEbayResult.shift();
				i++;
			}
			var temp = $scope.searchEbayResult.concat($scope.searchAmazonResult)
			$scope.searchResult = $scope.searchResult.concat(shuffle(temp));
			// console.log($scope.conditions);
			// console.log("Final search result in client side:", $scope.searchResult);
			$scope.dataLoaded = true;
		})
	}

	if($routeParams){
		// console.log('routeParams keyword',$routeParams.keywords)
		$scope.keywords = $routeParams.keywords
		//perform searchProduct function based on url param keyword
		$scope.searchProduct();
	}

	// $scope.searchProduct = function (){
	// 	searchProduct1()
	// }

	function createEbayList(obj){
		var temp = obj.findItemsByKeywordsResponse[0].searchResult[0].item
		// console.log("start converting the data...")
		$scope.searchEbayResult = [];
		if(temp != null){
			for(var i=0; i<temp.length; i++){
				var data = {};
				var title = temp[i].title[0];
				var viewURL = temp[i].viewItemURL[0];
				var imgURL;
				if(temp[i].pictureURLSuperSize != undefined){
					imgURL = temp[i].pictureURLLarge[0]
				}
				else if(temp[i].PictureURLLarge != undefined){
					imgURL = temp[i].PictureURLSuperSize[0]
				}
				else if(temp[i].galleryURL != undefined){
					imgURL = temp[i].galleryURL[0]
				}
				else{
					imgURL = ''
				}
				var price = parseFloat(temp[i].sellingStatus[0].currentPrice[0].__value__).toFixed(2);
				var condition;
				if(temp[i].condition == undefined){
					condition = 'Not available'
				}
				else{
					condition = temp[i].condition[0].conditionDisplayName[0];
				}
				if(condition in $scope.conditions){
					$scope.conditions[condition]++
				}
				else{
					$scope.conditions[condition] = 1;
				}
				var categoryId = temp[i].primaryCategory[0].categoryId[0];
				var categoryName = temp[i].primaryCategory[0].categoryName[0];
				var itemID = temp[i].itemId[0]
				var shipping;
				// var total_cost;
				if(temp[i].shippingInfo[0].shippingServiceCost === undefined){
					shipping = 'Check website';
				}
				else{
					if(temp[i].shippingInfo[0].shippingServiceCost[0].__value__ == '0.0'){
						shipping = parseFloat(0.00).toFixed(2);
					}
					else{
						shipping = parseFloat(temp[i].shippingInfo[0].shippingServiceCost[0].__value__).toFixed(2);
					}
				}
				// var start = temp[i].listingInfo[0].startTime[0];
				var end = temp[i].listingInfo[0].endTime[0];
				data = { 'seller': 'ebay', 'id': itemID, 'title': title, 'view': viewURL, 'img': imgURL, 'price': parseFloat(price), 'shipping': shipping, 'condition': condition, 'category': categoryName, 'endTime': end }
				$scope.searchEbayResult[i] = data
			}
			// console.log("Ebay search result", $scope.searchEbayResult)
		}
		// return $scope.searchResult;
	}

	function createAmazonList(obj){
		// console.log("start converting the data for Amazon...")
		$scope.searchAmazonResult = [];
		if(obj != null){
			for(var i=0; i<obj.length; i++){
				var data = {}
				// var lowest_Price;
				var list_Price = 'Check Website';
				var prime_item = false;
				var sale_Price;
				var PercentageSaved = 'N/A';
				var condition;
				var features;
				if(obj[i].ItemAttributes.Feature != undefined){
					features = obj[i].ItemAttributes.Feature
				}

				if(obj[i].ItemAttributes.ListPrice != undefined){
					list_Price = parseFloat(obj[i].ItemAttributes.ListPrice.Amount) / 100;
				}
				else{
					if(obj[i].Offers != undefined && obj[i].Offers.Offer != undefined){
						list_Price = parseFloat(obj[i].Offers.Offer.OfferListing.Price.Amount) / 100
					}
				}

				if(obj[i].Offers != undefined && obj[i].Offers.Offer != undefined){
					condition = obj[i].Offers.Offer.OfferAttributes.Condition
					if(obj[i].Offers.Offer.OfferListing != undefined){
						if(obj[i].Offers.Offer.OfferListing.IsEligibleForPrime == '1'){
							prime_item = true;
						}
						if(obj[i].Offers.Offer.OfferListing.PercentageSaved != undefined){
							PercentageSaved = obj[i].Offers.Offer.OfferListing.PercentageSaved
							if(obj[i].Offers.Offer.OfferListing.SalePrice != undefined){
								sale_Price = parseFloat(obj[i].Offers.Offer.OfferListing.SalePrice.Amount) / 100
								list_Price = parseFloat(obj[i].Offers.Offer.OfferListing.Price.Amount) / 100
							}
							else{
								sale_Price = parseFloat(obj[i].Offers.Offer.OfferListing.Price.Amount) / 100
							}
						}
					}
					else{
						console.log("OfferListing is not defined", i, obj[i])
					}
				}
				else{
					condition = 'Not available'
					console.log("No condition", i, obj[i])
				}

				if(condition in $scope.conditions){
					$scope.conditions[condition]++
				}
				else{
					$scope.conditions[condition] = 1;
				}

				var view;
				if(obj[i].LargeImage != undefined){
					view = obj[i].LargeImage.URL;
				}
				else{
					view = null
				}
				var categoryName = obj[i].ItemAttributes.Binding;
				data = { 'seller': 'amazon', 'id': obj[i].ASIN, 'title': obj[i].ItemAttributes.Title, 'view': obj[i].DetailPageURL, 'img': view, 'price': list_Price, 'sale_price': sale_Price, 'percentage_Saved': PercentageSaved, 'prime_item': prime_item, 'features': features, 'condition':  condition, 'category': categoryName,'CustomerReviews' : obj[i].CustomerReviews}
				$scope.searchAmazonResult[i] = data
			}
			// console.log("Amazon search result", $scope.searchAmazonResult)
		}
		return $scope.searchAmazonResult;
	}

	function shuffle(array) {
    var counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      var index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      var temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
	}
})
