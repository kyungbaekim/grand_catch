var express = require("express");
var app = express();
var path = require("path");
var bodyParser= require("body-parser");
var mongoose = require('mongoose');
var morgan = require('morgan');
var proxy = require('json-proxy/lib/proxy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "./node_modules")));
app.use(express.static(path.join(__dirname, "./client")));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect CSS bootstrap
app.use('/components', express.static(__dirname + '/node_modules')); // redirect moment compoments
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/fonts')); // redirect ui bootstrap

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);

app.use(morgan('dev'));
app.use(proxy.initialize({
  proxy: {
    'forward': {
      '/shopping': "http://open.api.ebay.com/",
      '/reviews': 'https://www.amazon.com/',
      '/itm': 'http://www.ebay.com/'
    }
  }
}));

//create proxy server for XOR request
// app.use(proxy.initialize({
// 	proxy: {
// 		'forward' : {
// 			'/reviews': 'https://www.amazon.com/'
// 		}
// 	}
// }))

port = 8000;
var server = app.listen(port, function(){
	console.log("********** PORT " + port + " PORT **********")
});
