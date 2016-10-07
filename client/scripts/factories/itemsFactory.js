myAppModule.factory('itemsFactory', function ($http){
	var factory = {};
  var url1 = 'https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=';
	var url2 = '&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.13.0&RESPONSE-DATA-FORMAT=JSONP&callback=JSON_CALLBACK&REST-PAYLOAD&keywords=';
	var url3 = '&paginationInput.entriesPerPage=100&outputSelector(0)=PictureURLLarge&outputSelector(1)=PictureURLSuperSize&paginationInput.pageNumber=1&GLOBAL-ID=EBAY-US&siteid=0';
	var production_app_id = 'TylerNgu-smarterc-PRD-a9a6113e8-7679c966';
	// var sandbox_app_id = 'TylerNgu-smarterc-SBX-a9a64d327-6ba5faaa';
	// var affiliateuserid = 'tylenguye_6';
	var affiliateTrackingId = 5337944795;
	var affiliateNetworkId = 9;
	var affiliateCustomId = 'tylenguye_6';
	var ebayitems = {};
	var awsitems = {};
	var timestamp;
	var keywords = {};

	factory.getItems = function(search, callback){
		var stack = [];
		stack.push(getEbayItem)
		stack.push(getAmazonItem)
		async.parallel(stack, function(err, results){
			if(err){
				console.log(err)
				return;
			}
			callback(results)
		});

		function getEbayItem(callback){
			// keywords = search
			url = url1 + production_app_id + url2 + search + url3 + '&affiliate.trackingId=' + affiliateTrackingId + '&affiliate.networkId=' + affiliateNetworkId + '&affiliate.customId=' + affiliateCustomId;
			$http.jsonp(url).success(function(res){
				ebayitems = res
				callback(null, ebayitems)
			})
		}

		function getAmazonItem(callback){
			//pass search as an object to http post request
			search = {
				keywords: search
			}
			$http.post('/search', search).then(function(res){
				awsitems = res.data;
				// console.log("From factory...:", res.data)
				callback(null, awsitems)
			})
		}
	}

	factory.getEbaySingleItem = function(param, callback){
		var itemID = param
		var URL = '/shopping?callname=GetSingleItem'
		URL += '&responseencoding=JSON&appid=' + production_app_id + '&'
		URL += 'siteid=0&version=975&ItemID=' + itemID + '&IncludeSelector=Description,ItemSpecifics,Details,ShippingCosts'
		$http.get(URL).success(function(res){
			// console.log("Success:", res)
			callback(res)
		}).error(function(res){
			console.log("error:", res)
		})
	}

	function isEmpty(object) {
	  for(var key in object) {
	    if(object.hasOwnProperty(key)){
	      return false;
	    }
	  }
	  return true;
	}

	factory.amazonReviewLookUp = function(data, callback){
		var start = new Date().getTime();
		var amazonReview = data.slice(21,data.length)
		// get the pages source of url
		$http.get(amazonReview).success(function(data){
			//url pattern to search for in page source
			var reviewUrl = 'out of 5 stars';
			//search for index of review URL in page source
			var index = data.search(reviewUrl) - 4;
			// console.log('index', index)
			var end = new Date().getTime();
			var time = end - start;
			if(index > -1 ){
				var word = data.substring(index);
				word = parseFloat(word.substring(0,3));
				// console.log('word', word)
			}
      // console.log('Execution time: ' + time + 'ms');
      callback(word)
		})
	}

	factory.ebayReviewLookUp = function(url, callback){
		var start = new Date().getTime();
		var review_url = url.replace("http://www.ebay.com/", "");
		$http.get(review_url).success(function(data){
			// url pattern to search for in page source
			var ratings = '<span class=\"ebay-review-start-rating\">';
			//search for index of review URL in page source
			var index = data.search(ratings)
			if(index > -1){
				var word = data.substring(index);
				word = parseFloat(word.substring(42, 45))
				// console.log(index, word)
				callback(word)
			}
		})
	}

	factory.getPopularEbayItems = function(cID, callback){
		var URL = '/MerchandisingService?OPERATION-NAME=getMostWatchedItems&'
   	URL += 'SERVICE-NAME=MerchandisingService&'
   	URL += 'SERVICE-VERSION=1.1.0&'
   	URL += 'CONSUMER-ID=' + production_app_id
   	URL += '&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&maxResults=12&categoryId=' + cID
		URL += '&affiliate.trackingId=' + affiliateTrackingId + '&affiliate.networkId=' + affiliateNetworkId + '&affiliate.customId=' + affiliateCustomId
		$http.get(URL).success(function(res){
			// console.log("Success:", res)
			callback(res)
		}).error(function(res){
			console.log("error:", res)
		})
	}

	factory.getPopularAmazonItems = function(department, callback){
		// console.log("Department code:", department)
		$http.get('/topSellers/' + department).then(function(res){
			// console.log("From factory...:", res)
			callback(res)
		})
	}

	// Amazon single item
	factory.itemLookUp = function(data, callback){
		// console.log('in itemLookup factor:', data)
		//run $http request to server routes
		$http.get('/itemLookUp/' + data).success(function(output){
			//run callback function to send data back to controller
			callback(output)
		})
	}

	factory.getEbayDailyDeals = function(callback){
		var URL = 'deals/v1/country/us/feed/json?feedType=json&count=20'
		$http.get(URL).success(function(res){
			// console.log("Success:", res)
			callback(res)
		}).error(function(res){
			console.log("error:", res)
		})
	}

	return factory;
})
