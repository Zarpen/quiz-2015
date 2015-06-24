// TODO: createdBy on table, and allow access only based on role (CRUD) and permission over record ownership
module.exports = {
	handlerNewQuiz:function(req,res,next){
		var anchor = this;
		this.ensureAuthorizedACL({req:req,res:res,next:next,handler:function(req1,res1,next1){
			anchor.viewVars.layout.title = "Quiz - Nueva Pregunta";
			var quiz = anchor.dbHelper.getModel("quiz").build(
				{pregunta:"pregunta",respuesta:"respuesta",tematica:"temática"}
			);
			anchor.viewVars.newquiz.quiz = quiz;
			return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
				{view:"newquiz",vars:anchor.viewVars.newquiz,linkVar:"body"}
			]});
		}});
	},
	handlerCreateQuiz:function(req,res,next){
		var anchor = this;
		var quiz = this.dbHelper.getModel("quiz").build(req.body.quiz);
		this.ensureAuthorizedACL({req:req,res:res,next:next,handler:function(req1,res1,next1){
			quiz.validate().then(function(err){
				if(err){
					anchor.viewVars.newquiz.quiz = quiz;
					anchor.viewVars.layout.errors = err.errors;
					return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
						{view:"newquiz",vars:anchor.viewVars.newquiz,linkVar:"body"}
					],handler:function(){ anchor.viewVars.layout.errors = ""; }});
				}else{
					quiz.save({fields: ["pregunta","respuesta","tematica"]}).then(function(){
						return res.redirect("/quizes");
					});
				}
			});
		}});
	},
	handlerEditQuiz:function(req,res,next){
		var anchor = this;
		this.ensureAuthorizedACL({req:req,res:res,next:next,handler:function(req1,res1,next1){
			anchor.viewVars.layout.title = "Quiz - Editar Pregunta";
			anchor.viewVars.editquiz.quiz = req.quiz;
			return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
				{view:"editquiz",vars:anchor.viewVars.editquiz,linkVar:"body"}
			]});
		}});
	},
	handlerUpdateQuiz:function(req,res,next){
		var anchor = this;
		this.ensureAuthorizedACL({req:req,res:res,next:next,handler:function(req1,res1,next1){
			req.quiz.pregunta = req.body.quiz.pregunta;
			req.quiz.respuesta = req.body.quiz.respuesta;
			req.quiz.tematica = req.body.quiz.tematica;
			req.quiz.validate().then(function(err){
				if(err){
					anchor.viewVars.editquiz.quiz = req.quiz;
					anchor.viewVars.layout.errors = err.errors;
					return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
						{view:"editquiz",vars:anchor.viewVars.editquiz,linkVar:"body"}
					],handler:function(){ anchor.viewVars.layout.errors = ""; }});
				}else{
					req.quiz.save({fields: ["pregunta","respuesta","tematica"]}).then(function(){
						return res.redirect("/quizes");
					});
				}
			});
		}});
	},
	handlerDestroyQuiz:function(req,res,next){
		var anchor = this;
		this.ensureAuthorizedACL({req:req,res:res,next:next,handler:function(req1,res1,next1){
			req.quiz.destroy().then(function(){
				return res.redirect("/quizes");
			}).catch(function(error){ return next(error); });
		}});
	},
	handlerQuizes:function(req,res,next){
		var anchor = this;
		var search = req.query.search;
		this.viewVars.layout.title = "Quiz - Preguntas";
		this.dbHelper.getModel("quiz").findAll(search ? 
			{where:["pregunta like ?","%"+search.replace(" ","%")+"%"],
			order:[["pregunta","ASC"]]} : {order:[["pregunta","ASC"]]}).then(function(quizes){
			anchor.viewVars.quizes.quizes = quizes;
			return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
				{view:"quizes",vars:anchor.viewVars.quizes,linkVar:"body"}
			]});
		}).catch(function(e){ return next(new Error(e)); });
	}
};
