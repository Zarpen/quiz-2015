var Site = require('../core/Site');

function Quizes(options){
	Site.prototype.constructor.apply(this,arguments);

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

	this.viewVars = {
		layout: {header:this.themes.base},
		index: {},
		question: {question:"Capital de Italia"},
		answer: {answer:""}
	};
}
Quizes.prototype = new Site();
Quizes.prototype.handlerIndex = function(req,res,next){
	this.viewVars.layout.title = "Quiz!";
	this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
		{view:"index",vars:this.viewVars.index,linkVar:"body"}
	]});
};
Quizes.prototype.handlerQuestion = function(req,res,next){
	this.viewVars.layout.title = "Quizes - Pregunta";
	this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
		{view:"question",vars:this.viewVars.question,linkVar:"body"}
	]});
};
Quizes.prototype.handlerAnswer = function(req,res,next){
	if(req.query.answer === "Roma" || req.query.answer === "roma"){
		this.viewVars.answer.answer = "Correcto";
	}else{
		this.viewVars.answer.answer = "Incorrecto";
	}
	this.viewVars.layout.title = "Quizes - respuesta";
	this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
		{view:"answer",vars:this.viewVars.answer,linkVar:"body"}
	]});
}; 

module.exports = Quizes;