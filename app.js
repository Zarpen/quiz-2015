var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var vhost = require('vhost');
var config = require('config');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var csrf = require('csurf')
// require core modules
var ENTRY = require('./core/entryPoint');
// require sites
var Quizes = require('./controllers/quiz_controller');
// csrf token value
var csrfValue = function(req) {
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token']);
  return token;
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// on render view, enabling this will integrate the view to default template (layout)
// as we want different functionality left it commented
// app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    //proxy: true, // trust reverse proxy
    //secure: true, // https
  }
}));
app.use(csrf({value: csrfValue}));
app.use(methodOverride("_method"));

ENTRY.setSitesBasePath(__dirname+"/public/");
ENTRY.addSite({"name":"quizes","site":new Quizes({
  application:app,name:"quizes",
  domain:"localhost",
  port:5000,
  sslPort:8443,
  allowOrigin:"*",
  sessionInactive:2})});
ENTRY.addHtAccessEntry({"handler":function(req,res,next){
  var err = new Error('Not Found');
  err.status = 404;
  return next(err);
}});
ENTRY.addHtAccessEntry({"handler":function(err, req, res, next){
  var errorStack = {};
  var errorSite = "Default";
  var fromSites = ENTRY.getSites();
  for(var key in fromSites){
    if(err && err.toString().indexOf(key) >= 0){
      errorSite = key;
      break;
    }
  }
  if (config.get(errorSite+'.LogLevel') === 'development') errorStack = err;
  res.status(err.status || 500);
  return res.render('error', {
    message: err.message,
    error: errorStack
  });
}});
ENTRY.init(app,path);

module.exports = app;