var express = require('express');
var indexRoutes = require('../routes/index.js');
var app = express();

function Site(name,domain,dirPath,viewsPath){
	this.name = name || "";
	this.domain = domain || "localhost";
	this.dirPath = dirPath || "public";
	this.viewsPath = viewsPath || "views";
	this.routes = [];
	this.templates = {};
	this.viewTemplate = {};

	this.setRoutes(indexRoutes[this.name]);
}
Site.prototype.addRoute = function(entry){
	this.routes.push(entry);
};
Site.prototype.getRoutes = function(){
	return this.routes;
};
Site.prototype.setRoutes = function(routes){
	this.routes = routes;
};
Site.prototype.getName = function(){
	return this.name;
}
Site.prototype.getDomain = function(){
	return this.domain;
}
Site.prototype.getDirPath = function(){
	return this.dirPath;
}
Site.prototype.getViewsPath = function(){
	return this.viewsPath;
}
Site.prototype.addPageTemplate = function(page,template){
	if(this.templates[page]){
		this.templates[page].push(template);
	}else{
		this.templates[page] = [template];
	}
};
Site.prototype.renderPageTemplates = function(page,vars){
	var lastTemplate = "";
	for(var i = this.templates[page].length-1;i >= 0;i--){
		var template = this.templates[page][i];
		if(vars[i]){
			for(key in vars[i]){
				template = template.replace("{$"+key+"}",vars[i][key]);
			}
		}
		if(template.indexOf("[$template]") >= 0){
			template = template.replace("[$template]",lastTemplate);
		}
		lastTemplate = template;
	}
	return lastTemplate;
};
Site.prototype.addViewTemplate = function(view,template){
	this.viewTemplate[view] = template;
};
Site.prototype.parseView = function(options){
	if(options.render){
		options.response.render(this.viewTemplate[options.view],options.vars,options.handler);
	}else{
		app.render(this.viewTemplate[options.view],options.vars,options.handler);
	}
};

module.exports = Site;