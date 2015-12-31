'use strict';

module.exports = function(app) {
    // User Routes
    var users = require('../controllers/users.controller');

    // Setting up the users profile api
    app.route('/api/users/me').get(users.me);

    app.route('/public/password/forgot').post(users.forgot);
    app.route('/public/password/reset').post(users.reset);
    app.route('/api/password/change').post(users.change);

    // Finish by binding the user middleware
    //app.param('userId', users.userByID);
};
