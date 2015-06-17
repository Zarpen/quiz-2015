var Bluebird = require('bluebird');

module.exports = {
  version: 2,
  description: "Added new column",
  up: function(migration, DataTypes) {
    // logic for transforming into the new state
    return migration.addColumn(
  	  'Quizzes',
  	  'tematica',
  	  {
  	    type:DataTypes.STRING,
  		  validate:{notEmpty: {msg: "Falta temática"}}
  	  }
  	);
  },
 
  down: function(migration, DataTypes) {
    // logic for reverting the changes
    return migration.removeColumn('Quizzes', 'tematica');
  }
}