'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
    // User Routes
    var users = require('../controllers/users.controller');

    // Setting up the users authentication api
    //app.route('/api/auth/signup').post(users.signup);
    app.route('/public/auth/signin').post(users.signin);
    //app.route('/api/auth/signout').get(users.signout);
};
