var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var vhost = require('vhost');
var config = require('config');
// require core modules
var ENTRY = require('./core/entryPoint');
// require sites
var Quizes = require('./controllers/quiz_controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

ENTRY.setSitesBasePath(__dirname+"/public/");
ENTRY.addSite({"name":"quizes","site":new Quizes("quizes","localhost","quizes/","quizes/")});
ENTRY.addHtAccessEntry({"handler":function(req,res,next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
  res.render('error', {
    message: err.message,
    error: errorStack
  });
}});
ENTRY.init(app,path);

module.exports = app;
