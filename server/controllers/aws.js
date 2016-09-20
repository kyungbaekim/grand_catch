var aws = require("aws-lib");
var amazon_access_key = 'AKIAJWHEI6NPMP7QFGBA'
var amazon_secret_key = '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'
var amazon_associate_id = 'smartercost-20'
var searchedItem = "";
var prodAdv = aws.createProdAdvClient(amazon_access_key, amazon_secret_key, amazon_associate_id);

async = require("async");

module.exports = {
	itemSearch : function (req, res){
		var stack = [];
		stack.push(testSearch1)
		stack.push(testSearch2)
		stack.push(testSearch3)
		stack.push(testSearch4)
		stack.push(testSearch5)
		keywords = req.body.keywords;
		console.log(keywords);
		async.parallel(stack, function(err, results){
			if(err){
				console.log(err)
				return;
			}
			res.json(results)
		});

		function testSearch1(callback){
			console.log("Searched keyword:", keywords);
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 1,  ResponseGroup:"Images,ItemAttributes,Offers,Features"}, function(err, result) {
				callback(null, result.Items.Item)
			})
		}

		function testSearch2(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 2,  ResponseGroup:"Images,ItemAttributes,Offers"}, function(err, result) {
				callback(null, result.Items.Item)
			})
		}

		function testSearch3(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 3,  ResponseGroup:"Images,ItemAttributes,Offers"}, function(err, result) {
				callback(null, result.Items.Item)
			})
		}

		function testSearch4(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 4,  ResponseGroup:"Images,ItemAttributes,Offers"}, function(err, result) {
				callback(null, result.Items.Item)
			})
		}

		function testSearch5(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 5,  ResponseGroup:"Images,ItemAttributes,Offers"}, function(err, result) {
				callback(null, result.Items.Item)
			})
		}
	},

	// itemLookUp: function(req, res){
	// 	console.log('in itemLookup', req.params.asin);
	// 	prodAdv.call("ItemLookup", {ItemId: req.params.asin, ResponseGroup:"Images,ItemAttributes,Offers,OfferFull,Reviews"}, function(err, result) {
	// 		res.json({result: result})
	// 	})
	// }
}
