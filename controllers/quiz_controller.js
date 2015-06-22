var Site = require('../core/Site');
var SqliteHelper = require('../core/SqliteHelper');
var config = require('config');
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

function Quizes(options){
	Site.prototype.constructor.apply(this,arguments);
	var anchor = this;
	this.dbHelper = new SqliteHelper();
	this.jwt = jwt;
	this.bcrypt = bcrypt;

	// TODO: add theme system to Site, maybe looking at constant partial html files
	this.themes = {
		base: "\
			<meta name='viewport' content='width=device-width, initial-scale=1'>\
			<link rel='stylesheet' type='text/css' href='"+this.fontPath+"roboto/stylesheet.css'>\
			<link rel='stylesheet' type='text/css' href='"+this.fontPath+"roboto-slab/stylesheet.css'>\
			<link rel='stylesheet' type='text/css' href='"+this.cssPath+"base.css'>\
			<link rel='stylesheet' type='text/css' href='"+this.cssPath+"smartphone.css'>\
			<link rel='stylesheet' type='text/css' href='"+this.cssPath+"widescreen.css'>\
			<link rel='stylesheet' type='text/css' href='"+this.cssPath+"tablet.css'>\
			<script src='"+this.jsPath+"core/angularjs-1.3.16.js'></script>\
			<script src='"+this.jsPath+"app.module.js'></script>\
			<script src='"+this.jsPath+"components/security/securityController.js'></script>\
			<script src='"+this.jsPath+"app.routes.js'></script>\
		"
	};

	this.dbHelper.setup({connectString:process.env.DATABASE_URL,
		storage:process.env.DATABASE_STORAGE ? __dirname+"/../databases/"+this.databasePath+process.env.DATABASE_STORAGE : null,modelsPath:this.modelsPath,
		migrationPath:this.migrationPath,migrationExt:this.migrationExt});
	this.dbHelper.connect().then(function(){
		anchor.dbHelper.getMigrator().up().then(function(migrations){
			console.log("Database: migrations executed");
			if(migrations && migrations.length) for(var i = 0;i < migrations.length;i++) console.log(migrations[i].file);
			anchor.dbHelper.getModel("quiz").findOrCreate({where:{respuesta:"Roma"},defaults:{pregunta:"Capital de Italia",respuesta:"Roma",tematica:"Otro"}});
			anchor.dbHelper.getModel("quiz").findOrCreate({where:{respuesta:"Lisboa"},defaults:{pregunta:"Capital de Portugal",respuesta:"Lisboa",tematica:"Otro"}});
		}).catch(function(e){ console.log("Database migration error "+e); });
	}).catch(function(e){ console.log("Database error "+e); });

	this.viewVars.layout = {title:"Quiz!",header:this.themes.base,base:function(){ return anchor.getSitePath.apply(anchor,arguments);},errors:""};
	this.viewVars.question = this.viewVars.answer = this.viewVars.quizes = this.viewVars.newquiz = this.viewVars.editquiz = this.viewVars.newcomment = {};
	this.viewVars.login = this.viewVars.register = this.viewVars.statistics = {};

	// load plugin handlers
	this.addPlugin("users",require("../plugins/core/users.js"));
	var plugins = this.getPlugins();
	for(plugin in plugins){
		for(handler in plugins[plugin]){
			Quizes.prototype[plugin+"_"+handler] = plugins[plugin][handler];
		}
	}
}
Quizes.prototype = new Site();
module.exports = Quizes;