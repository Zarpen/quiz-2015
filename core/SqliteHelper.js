var DBHelper = require('./DBHelper');

function SqliteHelper(){
	DBHelper.prototype.constructor.apply(this,arguments);
}
SqliteHelper.prototype = new DBHelper();

module.exports = SqliteHelper;
