var indexRoutes = {
	"quizes":[
		// params section
		{"type":"param","path":"quizid","plugin":"autoload","handler":"LoadQuiz"},
		{"type":"param","path":"commentid","plugin":"autoload","handler":"LoadComment"},
		// paths section
		// login - register
		{"type":"get","path":"/login","plugin":"users","handler":"GetLogin"},
		{"type":"post","path":"/login","plugin":"users","handler":"Login"},
		{"type":"get","path":"/logout","plugin":"users","handler":"Logout"},
		{"type":"get","path":"/sigin","plugin":"users","handler":"GetRegister"},
		{"type":"post","path":"/sigin","plugin":"users","handler":"Register"},
		// comments
		{"type":"post","path":"/quizes/:quizid(\\d+)/comments","plugin":"comment","handler":"CreateComment"},
		{"type":"get","path":"/quizes/:quizid(\\d+)/comments/new","plugin":"comment","handler":"NewComment"},
		{"type":"put","path":"/quizes/:quizid(\\d+)/comments/:commentid(\\d+)/publish","plugin":"comment","handler":"PublishComment"},
		{"type":"put","path":"/quizes/:quizid(\\d+)/comments/:commentid(\\d+)/unpublish","plugin":"comment","handler":"UnPublishComment"},
		// quizes
		{"type":"get","path":"/quizes","plugin":"quiz","handler":"Quizes"},
		{"type":"post","path":"/quizes/create","plugin":"quiz","handler":"CreateQuiz"},
		{"type":"get","path":"/quizes/new","plugin":"quiz","handler":"NewQuiz"},
		{"type":"put","path":"/quizes/:quizid(\\d+)","plugin":"quiz","handler":"UpdateQuiz"},
		{"type":"get","path":"/quizes/:quizid(\\d+)/edit","plugin":"quiz","handler":"EditQuiz"},
		{"type":"delete","path":"/quizes/:quizid(\\d+)","plugin":"quiz","handler":"DestroyQuiz"},
		// simple gets
		{"type":"get","path":"/quizes/statistics","plugin":"common","handler":"Statistics"},
		{"type":"get","path":"/quizes/:quizid(\\d+)","plugin":"common","handler":"Question"},
		{"type":"get","path":"/quizes/:quizid(\\d+)/answer","plugin":"common","handler":"Answer"},
		{"type":"get","path":"/author","plugin":"common","handler":"Author"}, // this site as main index
		{"type":"get","path":"/","plugin":"common","handler":"Index"} // this site as main index
	]
}
module.exports = indexRoutes;