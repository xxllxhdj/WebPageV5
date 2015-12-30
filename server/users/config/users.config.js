'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    config = require(path.resolve('./config/config')),
    expressJwt = require('express-jwt'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Module init function.
 */
module.exports = function(app) {
    app.use('/api', expressJwt({
        secret: config.jwtTokenSecret
    }));
    app.use(function(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.json({
                status: '4001',
                desc: '认证失败'
            });
        }
    });
    addDefaultUser();
};

function addDefaultUser() {
    User.findOne({usercode: 'admin'}, function (err, user) {
        if (err) {
            //callback(err);
        } else {
            if (!user) {
                var user = new User({
                    usercode: 'admin',
                    username: '管理员',
                    password: 'U9v587123!'
                });
                user.save(function (err) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                });
            }
        }
    });
}
