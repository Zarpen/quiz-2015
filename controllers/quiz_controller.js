var Site = require('../core/Site');
var SqliteHelper = require('../core/SqliteHelper');
var config = require('config');

function Quizes(options){
	Site.prototype.constructor.apply(this,arguments);
	var anchor = this;
	this.dbHelper = new SqliteHelper();

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
		"
	};

	this.dbHelper.setup({connectString:process.env.DATABASE_URL,
		storage:__dirname+"/../databases/"+this.databasePath+process.env.DATABASE_STORAGE,modelsPath:this.modelsPath});
	this.dbHelper.connect().then(function(){
		anchor.dbHelper.getModel("quizes").findOrCreate({where:{respuesta:"Roma"},defaults:{pregunta:"Capital de Italia",respuesta:"Roma"}});
	}).catch(function(e){ console.log("Database error "+e); });

	this.viewVars.layout = {title:"Quiz!",header:this.themes.base};
	this.viewVars.question = {question:"Capital de Italia"};
	this.viewVars.answer = {answer:""};
}
Quizes.prototype = new Site();
Quizes.prototype.handlerIndex = function(req,res,next){
	this.viewVars.layout.title = "Quiz!";
	this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
		{view:"index",vars:this.viewVars.index,linkVar:"body"}
	]});
};
Quizes.prototype.handlerQuestion = function(req,res,next){
	var anchor = this;
	this.dbHelper.getModel("quizes").findAll().then(function(quizes){
		anchor.viewVars.layout.title = "Quizes - Pregunta";
		anchor.viewVars.question.question = quizes[0].dataValues.pregunta;
		anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
			{view:"question",vars:anchor.viewVars.question,linkVar:"body"}
		]});
	}).catch(function(e){ next(new Error(e)); });
};
Quizes.prototype.handlerAnswer = function(req,res,next){
	var anchor = this;
	this.dbHelper.getModel("quizes").findAll().then(function(quizes){
		if(req.query.answer === quizes[0].dataValues.respuesta.toLowerCase() || req.query.answer === quizes[0].dataValues.respuesta){
			anchor.viewVars.answer.answer = "Correcto";
		}else{
			anchor.viewVars.answer.answer = "Incorrecto";
		}
		anchor.viewVars.layout.title = "Quizes - Respuesta";
		anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
			{view:"answer",vars:anchor.viewVars.answer,linkVar:"body"}
		]});
	}).catch(function(e){ next(new Error(e)); });
};
Quizes.prototype.handlerAuthor = function(req,res,next){
	this.viewVars.layout.title = "Quizes - Autor";
	this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
		{view:"author",vars:this.viewVars.author,linkVar:"body"}
	]});
} 

module.exports = Quizes;