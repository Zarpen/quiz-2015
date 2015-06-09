var Site = require('../core/Site');

function Quizes(name,domain,dirPath,viewsPath){
	Site.prototype.constructor.apply(this,arguments);

	this.addViewTemplate("index",this.viewsPath+"index");
	this.addViewTemplate("question",this.viewsPath+"question");
	this.addViewTemplate("answer",this.viewsPath+"answer");

	this.viewVars = {
		index: {title:"Quiz!"},
		question: {title:"Quizes - Pregunta",question:"Capital de Italia"},
		answer: {title:"Quizes - respuesta",answer:""}
	};
}
Quizes.prototype = new Site();
Quizes.prototype.handlerIndex = function(req,res,next){
	this.parseView({view:"index",render:true,response:res,vars:this.viewVars.index});
};
Quizes.prototype.handlerQuestion = function(req,res,next){
	this.parseView({view:"question",render:true,response:res,vars:this.viewVars.question});
};
Quizes.prototype.handlerAnswer = function(req,res,next){
	if(req.query.answer === "Roma" || req.query.answer === "roma"){
		this.viewVars.answer.answer = "Correcto";
	}else{
		this.viewVars.answer.answer = "Incorrecto";
	}
	this.parseView({view:"answer",render:true,response:res,vars:this.viewVars.answer});
}; 

module.exports = Quizes;