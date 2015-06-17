var indexRoutes = {
	"quizes":[
		// params section
		{"type":"param","path":"quizid","handler":"Load"},
		// paths section
		{"type":"post","path":"/quizes/create","handler":"CreateQuiz"},
		{"type":"get","path":"/quizes/new","handler":"NewQuiz"},
		{"type":"put","path":"/quizes/:quizid(\\d+)","handler":"UpdateQuiz"},
		{"type":"get","path":"/quizes/:quizid(\\d+)/edit","handler":"EditQuiz"},
		{"type":"delete","path":"/quizes/:quizid(\\d+)","handler":"DestroyQuiz"},
		{"type":"get","path":"/quizes/:quizid(\\d+)","handler":"Question"},
		{"type":"get","path":"/quizes/:quizid(\\d+)/answer","handler":"Answer"},
		{"type":"get","path":"/quizes","handler":"Quizes"},
		{"type":"get","path":"/author","handler":"Author"}, // this site as main index
		{"type":"get","path":"/","handler":"Index"} // this site as main index
	]
}
module.exports = indexRoutes;