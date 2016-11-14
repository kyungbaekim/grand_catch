var path = require("path");
var bodyParser= require("body-parser");
var morgan = require('morgan');
var proxy = require('json-proxy/lib/proxy');
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
var asyncJS = require('async');
var crypto = require('crypto');
var session = require('express-session');
var flash = require('connect-flash');

// var expressJwt = require('express-jwt');
var express = require("express");
var app = express();

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '1mb'}));

app.use(express.static(path.join(__dirname, "./node_modules")));
app.use(express.static(path.join(__dirname, "./client")));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect CSS bootstrap
app.use('/components', express.static(__dirname + '/node_modules')); // redirect moment compoments
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/fonts')); // redirect ui bootstrap
app.use('/pattern', express.static(__dirname + '/node_modules/url-pattern/lib')); // redirect url pattern

app.use(require('prerender-node'));
app.use(cookieParser());
app.use(flash());
app.use(session({
  secret: 'GrAnD_CaTcH',
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);

// app.use(morgan('dev'));
app.use(proxy.initialize({
  proxy: {
    'forward': {
      '/shopping': "http://open.api.ebay.com/",
      '/reviews': 'https://www.amazon.com/',
      '/itm': 'http://www.ebay.com/',
      '/MerchandisingService': "http://svcs.ebay.com/",
      '/deals': 'http://api.epn.ebay.com/',
    }
  }
}));

port = 8080;
var server = app.listen(port, function(){
	console.log("********** PORT " + port + " PORT **********")
});
