var express = require('express');
var vhost = require('vhost');
var favicon = require('serve-favicon');

var entry = (function(){
  var routes = [];
  var sites = {};
  var basePath = __dirname;

  var setSitesBasePath = function(sitesBasePath){
    basePath = sitesBasePath;
  };

  var getSitesBasePath = function(){
    return basePath;
  }

  var addSite = function(options){
    sites[options["name"]] = options["site"];
  };
  var setSites = function(allSites){
    sites = allSites;
  };
  var getSites = function(){
    return sites;
  };
  var addHtAccessEntry = function(entry){
    routes.push(entry);
  };
  var init = function(app,path){
    // sitePaths
    for(var site in sites){
      var siteRoutes = sites[site].getRoutes();
      var siteDomain = sites[site].getDomain();
      var siteDirPath = sites[site].getDirPath();
      var siteRouter = express.Router();
      for(var i = 0;i < siteRoutes.length;i++){
        var siteRoute = siteRoutes[i];
        siteRouter[siteRoute["type"]](siteRoute["path"],typeof siteRoute["handler"] 
          === 'function' ? siteRoute["handler"] : 
            (function(theSite,theHandler){
              return function(req,res,next){ 
                try{theSite[theHandler].apply(theSite,arguments);}catch(err){ next(err); } 
              }
            })(sites[site],"handler"+siteRoute["handler"]));
      }

      app.use(vhost(siteDomain,siteRouter));
      app.use(vhost(siteDomain,express.static(path.join(basePath, siteDirPath))));
      app.use(favicon(basePath + siteDirPath + 'favicon.ico'));
    }

    // HtAccessPaths (over default site)
    for(var i = 0;i < routes.length;i++){
      if(routes[i]["path"]){
        app.use(routes[i]["path"],function(req,res,next){ next(); });
        app[routes[i]["type"]](routes[i]["path"],routes[i]["handler"]);
      }
    }

    // defaultSite
    app.use(express.static(path.join(getSitesBasePath(), '')));
    app.use(favicon(getSitesBasePath() + 'favicon.ico'));

    // HtAccess without handler (usually error handling)
    for(var i = 0;i < routes.length;i++){
      if(!routes[i]["path"]){
        app.use(routes[i]["handler"]);
      }
    }

  };

  return {
    "setSitesBasePath":setSitesBasePath,
    "getSitesBasePath":getSitesBasePath,
    "addSite":addSite,
    "getSites":getSites,
    "setSites":setSites,
    "addHtAccessEntry":addHtAccessEntry,
    "init":init
  };
})();

module.exports = entry;
