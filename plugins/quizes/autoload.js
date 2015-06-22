module.exports = {
	handlerLoadQuiz:function(req,res,next,quizid){
		this.dbHelper.getModel("quiz").find({
			where: {id: Number(quizid)},
			include: [{ model: this.dbHelper.getModel("comment")}]
		}).then(function(quiz){
			if(quiz){
				req.quiz = quiz;
				return next();
			}else{ return next(new Error("No existe quizId = "+quizid)); }
		}).catch(function(error){ return next(error); });
	},
	handlerLoadComment:function(req,res,next,commentid){
		this.dbHelper.getModel("comment").find({
			where: {id: Number(commentid)}
		}).then(function(comment){
			if(comment){
				req.comment = comment;
				return next();
			}else{ return next(new Error("No existe commentId = "+commentid)); }
		}).catch(function(error){ return next(error); });
	}
};
