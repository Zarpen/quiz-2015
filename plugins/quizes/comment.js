module.exports = {
	handlerNewComment:function(req,res,next){
		this.viewVars.layout.title = "Nuevo comentario";
		this.viewVars.newcomment.quizid = req.params.quizid;
		return this.parseView({view:"layout",render:true,response:res,vars:this.viewVars.layout,partials:[
			{view:"newcomment",vars:this.viewVars.newcomment,linkVar:"body"}
		]});
	},
	handlerCreateComment:function(req,res,next){
		var anchor = this;
		var comment = this.dbHelper.getModel("comment").build({
			texto: req.body.comment.texto,
			QuizId: req.params.quizid
		});

		comment.validate().then(function(err){
			if(err){
				anchor.viewVars.newcomment.comment = comment;
				anchor.viewVars.layout.errors = err.errors;
				return anchor.parseView({view:"layout",render:true,response:res,vars:anchor.viewVars.layout,partials:[
					{view:"newcomment",vars:anchor.viewVars.newcomment,linkVar:"body"}
				],handler:function(){ anchor.viewVars.layout.errors = ""; }});
			}else{
				comment.save().then(function(){
					return res.redirect("/quizes/"+req.params.quizid);
				});
			}
		});
	},
	handlerPublishComment:function(req,res,next){
		this.ensureAuthorizedACL({req:req,res:res,next:next,handler:function(req1,res1,next1){
			req1.comment.dataValues.publicado = true;
			req1.comment.save({fields:["publicado"]}).then(function(){
				return res1.redirect("/quizes/"+req1.params.quizid)
			}).catch(function(error){ return next1(error); });
		}});
	},
	handlerUnPublishComment:function(req,res,next){
		this.ensureAuthorizedACL({req:req,res:res,next:next,handler:function(req1,res1,next1){
			req1.comment.dataValues.publicado = false;
			req1.comment.save({fields:["publicado"]}).then(function(){
				return res1.redirect("/quizes/"+req1.params.quizid)
			}).catch(function(error){ return next1(error); });
		}});
	}
};
