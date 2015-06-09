var indexRoutes = {
	"quizes":[
		{"type":"get","path":"/quizes/question","handler":"Question"},
		{"type":"get","path":"/quizes/answer","handler":"Answer"},
		{"type":"get","path":"/","handler":"Index"} // this site as main index
	]
}
module.exports = indexRoutes;