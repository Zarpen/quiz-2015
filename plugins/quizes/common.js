module.exports = {
	handlerStatistics:function(req,res,next){
		var anchor = this;
		var sequelize = this.dbHelper.getSequelize();
		this.viewVars.statistics.statistics = {
			questions:0,
			comments:0,
			commentsQuestions:0,
			questionsNoComments:0,
			questionComments:0
		}
		this.dbHelper.getModel("quiz").count().then(function(count){
			anchor.viewVars.statistics.statistics.questions = count;
			anchor.dbHelper.getModel("comment").count().then(function(count1){
				anchor.viewVars.statistics.statistics.comments = count1;
				anchor.dbHelper.getModel("quiz").count({
							distinct: true,
							include:[{required:true,model:anchor.dbHelper.getModel("comment")}]}
					).then(function(count2){
						anchor.viewVars.statistics.statistics.questionComments = count2;
						anchor.viewVars.statistics.statistics.questionNoComments = 
							anchor.viewVars.statistics.statistics.questions - anchor.viewVars.statistics.statistics.questionComments;
						anchor.viewVars.statistics.statistics.commentsQuestions = 
							(anchor.viewVars.statistics.statistics.comments / anchor.viewVars.statistics.statistics.questions).toFixed(1);
						return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
							{view:"statistics",vars:anchor.viewVars.statistics,linkVar:"body"}
						]});
				}).catch(function(error){ return next(error); });
			}).catch(function(error){ return next(error); });
		}).catch(function(error){ return next(error); });
	},
	handlerIndex:function(req,res,next){
		this.viewVars.layout.title = "Quiz!";
		return this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
			{view:"index",vars:this.viewVars.index,linkVar:"body"}
		]});
	},
	handlerQuestion:function(req,res,next){
		var anchor = this;
		anchor.viewVars.layout.title = "Quizes - Pregunta";
		anchor.viewVars.question.question = req.quiz.dataValues;
		return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
			{view:"question",vars:anchor.viewVars.question,linkVar:"body"}
		]});
	},
	handlerAnswer:function(req,res,next){
		var anchor = this;
		anchor.viewVars.layout.title = "Quizes - Respuesta";
		anchor.viewVars.answer.quiz = req.quiz.dataValues;
		anchor.viewVars.answer.answer = "Incorrecto";
		if(req.query.answer === req.quiz.dataValues.respuesta.toLowerCase() || req.query.answer === req.quiz.dataValues.respuesta){
			anchor.viewVars.answer.answer = "Correcto";
		}
		return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
			{view:"answer",vars:anchor.viewVars.answer,linkVar:"body"}
		]});
	},
	handlerAuthor:function(req,res,next){
		this.viewVars.layout.title = "Quizes - Autor";
		return this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
			{view:"author",vars:this.viewVars.author,linkVar:"body"}
		]});
	}
} 
