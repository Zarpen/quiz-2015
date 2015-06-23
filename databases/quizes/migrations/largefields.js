var Bluebird = require('bluebird');

module.exports = {
  version: 4,
  description: "Change datatype",
  up: function(migration, DataTypes) {
    // logic for transforming into the new state
    return migration.changeColumn(
  	  'Users',
  	  'token',
  	  {
  	    type:DataTypes.TEXT
  	  }
  	).then(function(){
  		migration.changeColumn(
	  	  'Users',
	  	  'password',
	  	  {
	  	    type:DataTypes.TEXT
	  	  }
	  	);
  	});
  },
 
  down: function(migration, DataTypes) {
    // logic for reverting the changes
    return migration.changeColumn(
  	  'Users',
  	  'token',
  	  {
  	    type:DataTypes.STRING
  	  }
  	).then(function(){
  		migration.changeColumn(
	  	  'Users',
	  	  'password',
	  	  {
	  	    type:DataTypes.STRING
	  	  }
	  	);
  	});
  }
} 
