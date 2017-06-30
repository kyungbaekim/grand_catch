var aws = require("aws-lib");
//IAM prodcut api user
var k1 = '00AKIAINYRXIGXBX4UOP6A00'
var s1 = '00i3v82lczYGjwq1ZcS9yaeLJd3Ngx14Goh90CwbMr00'
var aa_id = 'grandcatch-20'
var searchedItem = "";
var prodAdv = aws.createProdAdvClient(k1.slice(2,k1.length-2), s1.slice(2,s1.length-2), aa_id);

async = require("async");

module.exports = {
	itemSearch : function (req, res){
		console.log("Searched keyword:", keywords);
		var stack = [];
		var data;
		stack.push(testSearch1)
		stack.push(testSearch2)
		stack.push(testSearch3)
		stack.push(testSearch4)
		stack.push(testSearch5)
		var keywords = req.body.keywords;
		console.log(keywords);
		async.parallel(stack, function(err, results){
			if(err){
				console.log(err)
				return;
			}
			res.json(results)
		});

		function testSearch1(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 1,  ResponseGroup:"Images,ItemAttributes,Offers,Reviews,BrowseNodes"}, function(err, result) {
				if(result.Items == undefined){
					data = {'item': result, 'page': 1}
				}
				else{
					data = {'item': result.Items.Item, 'page': 1}
				}
				// console.log(data)
				callback(null, data)
			})
		}

		function testSearch2(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 2,  ResponseGroup:"Images,ItemAttributes,Offers,Reviews,BrowseNodes"}, function(err, result) {
				if(result.Items == undefined){
					data = {'item': result, 'page': 2}
				}
				else{
					data = {'item': result.Items.Item, 'page': 2}
				}
				// console.log(data)
				callback(null, data)
			})
		}

		function testSearch3(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 3,  ResponseGroup:"Images,ItemAttributes,Offers,Reviews,BrowseNodes"}, function(err, result) {
				if(result.Items == undefined){
					data = {'item': result, 'page': 3}
				}
				else{
					data = {'item': result.Items.Item, 'page': 3}
				}
				// console.log(data)
				callback(null, data)
			})
		}

		function testSearch4(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 4,  ResponseGroup:"Images,ItemAttributes,Offers,Reviews,BrowseNodes"}, function(err, result) {
				if(result.Items == undefined){
					data = {'item': result, 'page': 4}
				}
				else{
					data = {'item': result.Items.Item, 'page': 4}
				}
				// console.log(data)
				callback(null, data)
			})
		}

		function testSearch5(callback){
			prodAdv.call("ItemSearch", {SearchIndex: "All", Keywords: keywords, ItemPage: 5,  ResponseGroup:"Images,ItemAttributes,Offers,Reviews,BrowseNodes"}, function(err, result) {
				if(result.Items == undefined){
					data = {'item': result, 'page': 5}
				}
				else{
					data = {'item': result.Items.Item, 'page': 5}
				}
				// console.log(data)
				callback(null, data)
			})
		}
	},

	topSellers: function(req, res){
		// console.log('in topSellers', req.params.department);
		var option = {BrowseNodeId: "All", ResponseGroup:"TopSellers"}
		prodAdv.call("BrowseNodeLookup", {BrowseNodeId: req.params.department, ResponseGroup:"TopSellers"}, function(err, result) {
			res.json({result: result})
		})
	},

	itemLookUp: function(req, res){
		// console.log('in itemLookup', req.params.asin);
		prodAdv.call("ItemLookup", {ItemId: req.params.asin, ResponseGroup:"Images,ItemAttributes,Offers,OfferFull,Reviews"}, function(err, result) {
			res.json({result: result})
		})
	}
}
