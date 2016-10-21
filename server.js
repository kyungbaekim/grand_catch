var express = require("express");
var app = express();
var path = require("path");
var bodyParser= require("body-parser");
var mongoose = require('mongoose');
var morgan = require('morgan');
var proxy = require('json-proxy/lib/proxy');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '1mb'}));

app.use(express.static(path.join(__dirname, "./node_modules")));
app.use(express.static(path.join(__dirname, "./client")));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect CSS bootstrap
app.use('/components', express.static(__dirname + '/node_modules')); // redirect moment compoments
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/fonts')); // redirect ui bootstrap
app.use('/pattern', express.static(__dirname + '/node_modules/url-pattern/lib')); // redirect url pattern

app.use(cookieParser());

app.use(session({
  cookieName: 'session',
  secret: 'GrAnD_CaTcH',
  duration: 30 * 60 * 1000,
  activeDuration: 10 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);

app.use(morgan('dev'));
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

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.session.user = {
          id: user._id,
          name: user.fname + " " + user.lname,
          email: user.email
        }
        // req.user = user;
        // delete req.user.password; // delete the password from the session
        // req.session.user = user;  //refresh the session value
        res.locals.user = user;
        console.log("locals.user data:", res.locals.user)
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

port = 8000;
var server = app.listen(port, function(){
	console.log("********** PORT " + port + " PORT **********")
});
