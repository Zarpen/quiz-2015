var indexRoutes = require('../routes/index.js');
var fs = require('fs');

function Site(options){
	for(var key in options){
		this[key] = options[key];
	}

	this.routes = [];
	this.templates = {};
	this.viewTemplate = {};
	this.cssPath = "stylesheets/";
	this.jsPath = "javascripts/";
	this.imgPath = "images/";
	this.fontPath = "fonts/";

	if(this.name){
		this.setRoutes(indexRoutes[this.name]);
	}

	// read views (read views async ¿?)
	if(this.viewsPath){
		var dirViews = fs.readdirSync(__dirname+"/../views/"+this.viewsPath);
		for(var i = 0;i < dirViews.length;i++){
			var noExtension = dirViews[i].substr(0,dirViews[i].lastIndexOf("."));
			this.addViewTemplate(noExtension,this.viewsPath+noExtension);
		}
	}
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
	var me = this;

	if(options.partials){
		var partialsLen = options.partials.length;
		var varsToDelete = [];
		var attachPartial = function(index){
			if(index < partialsLen){
				me.application.render(me.viewTemplate[options.partials[index]["view"]],options.partials[index]["vars"],function(err, html){
					if(options.vars.hasOwnProperty(options.partials[index]["linkVar"]) === false){
						options.vars[options.partials[index]["linkVar"]] = html;
						varsToDelete.push(options.partials[index]["linkVar"]);
					}
					attachPartial(index+1);
				});
			}else{
				if(options.render){
					options.response.render(me.viewTemplate[options.view],options.vars,function(err,html){
						for(var i = 0;i < varsToDelete.length;i++) delete options.vars[varsToDelete[i]];
						if(options.handler) options.handler(err,html);
						varsToDelete = [];
						options.response.send(html);
					});
				}else{
					me.application.render(me.viewTemplate[options.view],options.vars,function(err,html){
						for(var i = 0;i < varsToDelete.length;i++) delete options.vars[varsToDelete[i]];
						if(options.handler) options.handler(err,html);
						varsToDelete = [];
					});
				}
			}
		}
		attachPartial(0);
	}else{
		if(options.render){
			options.response.render(this.viewTemplate[options.view],options.vars,options.handler);
		}else{
			this.application.render(this.viewTemplate[options.view],options.vars,options.handler);
		}
	}
};

module.exports = Site;