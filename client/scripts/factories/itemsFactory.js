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
		// console.log('in itemLookup factory')
		var start = new Date().getTime();
		var amazonReview = data.slice(21,data.length)
		// console.log('amazone review', amazonReview)
		$http.get(amazonReview).success(function(data){
			// console.log('data in reviews', data);
			//url pattern to search for in page source
			var reviewUrl = 'https://images-na.ssl-images-amazon.com/images/G/01/x-locale/common/customer-reviews/ratings/stars';
			// console.log('reviews', reviewUrl.length)
			//search for index of review URL in page source
			var index = data.search(reviewUrl)
			var end = new Date().getTime();
			var time = end - start;
			var word = data.substring(index);
			word = word.substring(0,reviewUrl.length + 4) + '._CB_.gif'
			// var res = str.substring(1, 4);
      console.log('Execution time: ' + time + 'ms');
      // console.log('word', word)
      callback(word)
		})
	}

	factory.ebayReviewLookUp = function(url, callback){
		var start = new Date().getTime();
		var review_url = url.replace("http://www.ebay.com/", "");
		// console.log('review url', url)
		$http.get(review_url).success(function(data){
			// url pattern to search for in page source
			var ratings = '<span class=\"ebay-review-start-rating\">';
			// console.log(ratings)
			// console.log('reviews', reviewUrl.length)
			//search for index of review URL in page source
			var index = data.search(ratings)
			// var end = new Date().getTime();
			// var time = end - start;
			var word = data.substring(index);
			word = parseFloat(word.substring(42, 45))
			console.log(index, word)
			if(index > -1){
				callback(word)
			}
		})
	}

	return factory;
})
