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
		storage:process.env.DATABASE_STORAGE ? __dirname+"/../databases/"+this.databasePath+process.env.DATABASE_STORAGE : null,modelsPath:this.modelsPath});
	this.dbHelper.connect().then(function(){
		anchor.dbHelper.getModel("quizes").findOrCreate({where:{respuesta:"Roma"},defaults:{pregunta:"Capital de Italia",respuesta:"Roma"}});
		anchor.dbHelper.getModel("quizes").findOrCreate({where:{respuesta:"Lisboa"},defaults:{pregunta:"Capital de Portugal",respuesta:"Lisboa"}});
	}).catch(function(e){ console.log("Database error "+e); });

	this.viewVars.layout = {title:"Quiz!",header:this.themes.base,base:function(){ return anchor.getSitePath.apply(anchor,arguments);}};
	this.viewVars.question = this.viewVars.answer = this.viewVars.quizes = {};
}
Quizes.prototype = new Site();
Quizes.prototype.handlerLoad = function(req,res,next,quizid){
	this.dbHelper.getModel("quizes").findById(quizid).then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		}else{ next(new Error("No existe quizId = "+quizid)); }
	}).catch(function(error){ next(error); });
}
Quizes.prototype.handlerIndex = function(req,res,next){
	this.viewVars.layout.title = "Quiz!";
	this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
		{view:"index",vars:this.viewVars.index,linkVar:"body"}
	]});
};
Quizes.prototype.handlerQuizes = function(req,res,next){
	var anchor = this;
	var search = req.query.search;
	this.viewVars.layout.title = "Quiz - Preguntas";
	this.dbHelper.getModel("quizes").findAll(search ? 
		{where:["pregunta like ?","%"+search.replace(" ","%")+"%"],
		order:[["pregunta","ASC"]]} : {order:[["pregunta","ASC"]]}).then(function(quizes){
		anchor.viewVars.quizes.quizes = quizes;
		anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
			{view:"quizes",vars:anchor.viewVars.quizes,linkVar:"body"}
		]});
	}).catch(function(e){ next(new Error(e)); });
}
Quizes.prototype.handlerQuestion = function(req,res,next){
	var anchor = this;
	anchor.viewVars.layout.title = "Quizes - Pregunta";
	anchor.viewVars.question.question = req.quiz.dataValues;
	anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
		{view:"question",vars:anchor.viewVars.question,linkVar:"body"}
	]});
};
Quizes.prototype.handlerAnswer = function(req,res,next){
	var anchor = this;
	anchor.viewVars.layout.title = "Quizes - Respuesta";
	anchor.viewVars.answer.quiz = req.quiz.dataValues;
	anchor.viewVars.answer.answer = "Incorrecto";
	if(req.query.answer === req.quiz.dataValues.respuesta.toLowerCase() || req.query.answer === req.quiz.dataValues.respuesta){
		anchor.viewVars.answer.answer = "Correcto";
	}
	anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
		{view:"answer",vars:anchor.viewVars.answer,linkVar:"body"}
	]});
};
Quizes.prototype.handlerAuthor = function(req,res,next){
	this.viewVars.layout.title = "Quizes - Autor";
	this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
		{view:"author",vars:this.viewVars.author,linkVar:"body"}
	]});
} 

module.exports = Quizes;