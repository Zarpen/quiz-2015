var Bluebird = require('bluebird');

module.exports = {
  version: 3,
  description: "Added new column",
  up: function(migration, DataTypes) {
    // logic for transforming into the new state
    return migration.addColumn(
  	  'Comments',
  	  'publicado',
  	  {
  	    type:DataTypes.BOOLEAN,
  	    defaultValue: false
  	  }
  	);
  },
 
  down: function(migration, DataTypes) {
    // logic for reverting the changes
    return migration.removeColumn('Comments', 'publicado');
  }
}