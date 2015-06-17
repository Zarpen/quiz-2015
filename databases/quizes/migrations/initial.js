var Bluebird = require('bluebird');

module.exports = {
  version: 1,
  description: "Initial model state, no changes",
  up: function(migration, DataTypes) {
    return new Bluebird(function (resolve, reject) {
      // Describe how to achieve the task.
      // Call resolve/reject at some point.
      return resolve();
    });
  },
 
  down: function(migration, DataTypes) {
    return new Bluebird(function (resolve, reject) {
      // Describe how to achieve the task.
      // Call resolve/reject at some point.
      return resolve();
    });
  }
}
