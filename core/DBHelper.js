var path = require('path');
var Sequelize = require('sequelize');
var fs = require('fs');

function DBHelper(){
	this.config = {};
	this.sequelize = false;
	this.models = {};
}
DBHelper.prototype.setup = function(options){
	this.config = options;
	this.config.omitNull = true;
	if(options.connectString){
		var parameters = options.connectString.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
		this.config.database = parameters[6]||null;
		this.config.username = parameters[2]||null;
		this.config.password = parameters[3]||null;
		this.config.protocol = parameters[1]||null;
		this.config.dialect = parameters[1]||null;
		this.config.port = parameters[5]||null;
		this.config.host = parameters[4]||null;
	}
	console.log(this.config);
}
DBHelper.prototype.connect = function(){
	var database = this.config["database"] || null;
	var username = this.config["username"] || null;
	var password = this.config["password"] || null;

	this.sequelize = new Sequelize(database,username,password,this.config);

	if(this.config["modelsPath"]){
		var dirModels = fs.readdirSync(__dirname+"/../models/"+this.config["modelsPath"]);
		for(var i = 0;i < dirModels.length;i++){
			var noExtension = dirModels[i].substr(0,dirModels[i].lastIndexOf("."));
			this.models[noExtension] = this.sequelize.import(path.join(__dirname+"/../models/"+this.config["modelsPath"],noExtension));
		}
	}

	return this.sequelize.sync();
}
DBHelper.prototype.getModel = function(name){
	return this.models[name];
}

module.exports = DBHelper;