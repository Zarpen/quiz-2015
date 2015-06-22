var indexRoutes = require('../routes/index.js');
var fs = require('fs');

function Site(options){
	for(var key in options){
		this[key] = options[key];
	}

	this.routes = [];
	this.templates = {};
	this.viewTemplate = {};
	this.viewVars = {};
	this.cssPath = "stylesheets/";
	this.jsPath = "javascripts/";
	this.imgPath = "images/";
	this.fontPath = "fonts/";
	this.dbHelper = false;
	this.csrfToken = false;
	this.authToken = false;
	this.controllers = {};
	this.plugins = {};

	if(this.name){
		this.domain = this.domain ? this.domain : "localhost";
		this.protocol = this.protocol ? this.protocol : "http";
		this.port = this.port ? this.port : "";
		this.sslPort = this.sslPort ? this.sslPort : "";
		this.dirPath = this.dirPath ? this.dirPath : options.name+"/";
		this.viewsPath = this.viewsPath ? this.viewsPath : options.name+"/";
		this.modelsPath = this.modelsPath ? this.modelsPath : options.name+"/";
		this.databasePath = this.databasePath ? this.databasePath : options.name+"/";
		this.migrationPath = this.migrationPath ? this.migrationPath : options.name+"/migrations/";
		this.pluginsPath = this.pluginsPath ? this.pluginsPath : options.name+"/";
		this.migrationExt = this.migrationExt ? this.migrationExt : "js";
		this.setRoutes(indexRoutes[this.name]);
	}

	// read views (read views async ¿?)
	if(this.viewsPath){
		var dirViews = fs.readdirSync(__dirname+"/../views/"+this.viewsPath);
		for(var i = 0;i < dirViews.length;i++){
			var noExtension = dirViews[i].substr(0,dirViews[i].lastIndexOf("."));
			this.addViewTemplate(noExtension,this.viewsPath+noExtension);
			this.viewVars[noExtension] = {};
		}
	}

	// read plugins (read plugins async ¿?)
	if(this.pluginsPath){
		var dirPlugins = fs.readdirSync(__dirname+"/../plugins/"+this.pluginsPath);
		for(var i = 0;i < dirPlugins.length;i++){
			var noExtension = dirPlugins[i].substr(0,dirPlugins[i].lastIndexOf("."));
			this.addPlugin(noExtension,require(__dirname+"/../plugins/"+this.pluginsPath+dirPlugins[i]));
		}
	}
}
Site.prototype.addController = function(name,controller){
	this.controllers[name] = controller;
};
Site.prototype.getController = function(name){
	return this.controllers[name];
};
Site.prototype.addRoute = function(entry){
	this.routes.push(entry);
};
Site.prototype.getRoutes = function(){
	return this.routes;
};
Site.prototype.setOptions = function(req,res,next){
	// TODO: handle more options here (req.socket.localPort for port)
	this.protocol = req.protocol;

	// set xsrf token
	this.csrfToken = req.csrfToken();
	res.cookie('XSRF-TOKEN', this.csrfToken);
	
	// disable cache
	if(this.disableCache){
		res.setHeader('Cache-Control', 'no-cache, must-revalidate');
	    res.setHeader('Expires', 'Mon, 26 Jul 1997 05:00:00 GMT');
	    res.setHeader('Pragma', 'no-cache');
	}

	if(this.allowOrigin){
		res.setHeader('Access-Control-Allow-Origin', this.allowOrigin);
    	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	}

	req.session.redir = req.session.redir ? req.session.redir : "/";

	if(req.session && req.session.token){
		this.authToken = req.session.token;
		if(!req.session.tokenExpire){
			req.session.tokenExpire = (new Date()).getTime();
		}else{
			if((new Date()).getTime() - req.session.tokenExpire > this.sessionInactive*60*1000){
				res.locals.session = req.session;
				delete req.session.token;
				delete req.session.tokenExpire
				this.authToken = false;
				return res.redirect(req.session.redir ? req.session.redir.toString() : '/login');
			}else{
				req.session.tokenExpire = (new Date()).getTime();
			}
		}
	}else{
		this.authToken = false;
	}

	res.locals.session = req.session;

	return next();
}
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
Site.prototype.getSitePath = function(){
	return this.protocol+"://"+this.domain+(this.protocol.indexOf("https") >= 0 ? 
		(this.sslPort ? ":"+this.sslPort : "") : (this.port ? ":"+this.port : ""))+"/"+this.dirPath;
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
Site.prototype.addPlugin = function(name,plugin){
	this.plugins[name] = plugin; 
}
Site.prototype.getPlugins = function(){
	return this.plugins;
}
Site.prototype.getPlugin = function(name){
	return this.plugins[name];
}
Site.prototype.addViewTemplate = function(view,template){
	this.viewTemplate[view] = template;
};
Site.prototype.parseView = function(options){
	var me = this;

	options.vars._csrf = this.csrfToken;
	options.vars._auth = this.authToken;

	if(options.partials){
		var partialsLen = options.partials.length;
		var varsToDelete = [];
		varsToDelete.push("_csrf");
		varsToDelete.push("_auth");
		var attachPartial = function(index){
			if(index < partialsLen){
				options.partials[index]["vars"]["_csrf"] = options.vars._csrf;
				options.partials[index]["vars"]["_auth"] = options.vars._auth;
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
			options.response.render(this.viewTemplate[options.view],options.vars,function(err,html){
				if(options.handler) options.handler(err,html);
				delete options.vars["_csrf"];
				delete options.vars["_auth"];
			});
		}else{
			this.application.render(this.viewTemplate[options.view],options.vars,function(err,html){
				if(options.handler) options.handler(err,html);
				delete options.vars["_csrf"];
				delete options.vars["_auth"];
			});
		}
	}
};
Site.prototype.ensureAuthorizedACL = function(options){
	if (options.req.session && options.req.session.token) {
    	this.dbHelper.getModel("user").findOne({where:{token:options.req.session.token}}).then(function(user){
    		if(user){
	        	options.handler(options.req,options.res,options.next);
	        }else{
	        	return options.res.send(403);
	        }
    	}).catch(function(error){ return options.next(error); });
    } else {
        return options.res.send(403);
    }
}
module.exports = Site;