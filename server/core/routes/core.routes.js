'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.controller');

  // Define application route
  app.route('/*').get(core.renderIndex);
};
