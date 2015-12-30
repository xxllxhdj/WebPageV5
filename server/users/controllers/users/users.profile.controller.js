'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    errorHandler = require(path.resolve('./server/core/controllers/errors.controller')),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Send User
 */
exports.me = function(req, res) {
    User.findOne({usercode: req.user.usercode}, function (err, user) {
        if (err) {
            res.json({
                status: 'EEEE',
                desc: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!user) {
                res.json({
                    status: 'EEEE',
                    desc: '不存在该用户'
                });
            } else {
                res.json({
                    status: '0000',
                    data: {
                        username: user.username,
                        photo: user.profileImageURL
                    }
                });
            }
        }
    });
};
