'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    errorHandler = require(path.resolve('./server/core/controllers/errors.controller')),
    config = require(path.resolve('./config/config')),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function (req, res) {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init Variables
    var user = new User(req.body);

    // Then save the user
    user.save(function (err) {
        if (err) {
            res.json({
                status: 'EEEE',
                desc: errorHandler.getErrorMessage(err)
            });
        } else {
            login(user.usercode, user.password, false, function (err, obj) {
                if (err) {
                    res.json({
                        status: 'EEEE',
                        desc: err.message
                    });
                } else {
                    res.json({
                        status: '0000',
                        data: obj
                    });
                }
            });
        }
    });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
    login(req.body.usercode, req.body.password, req.body.rememberme, function (err, obj) {
        if (err) {
            res.json({
                status: 'EEEE',
                desc: err.message
            });
        } else {
            res.json({
                status: '0000',
                data: obj
            });
        }
    });
};

function login (usercode, password, rememberme, callback) {
    var usercode = usercode || '';
    var password = password || '';

    if (usercode == '' || password == '') {
        callback({
            message: '用户名或密码不能为空'
        });
    }
    User.findOne({usercode: usercode}, function (err, user) {
        if (err) {
            callback(err);
        } else {
            if (!user) {
                callback({
                    message: '该用户不存在'
                });
            } else {
                user.authenticate(password, function(isMatch) {
                    if (!isMatch) {
                        callback({
                            message: '密码错误'
                        });
                    } else {
                        var token = jwt.sign({
                            usercode: user.usercode,
                            roles: user.roles
                        }, config.jwtTokenSecret, {
                            expiresIn: rememberme ? '20 y' : '2 h'
                        });
                        callback(null, {
                            token: token
                        });
                    }
                });
            }
        }
    });
}
