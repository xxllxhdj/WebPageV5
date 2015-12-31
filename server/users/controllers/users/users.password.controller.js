'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    config = require(path.resolve('./config/config')),
    errorHandler = require(path.resolve('./server/core/controllers/errors.controller')),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer'),
    async = require('async'),
    generatePassword = require('generate-password'),
    jwt = require('jsonwebtoken');

var smtpTransport = nodemailer.createTransport(config.mailer.options);
/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
    async.waterfall([
        // Lookup user by username
        function(done) {
            if (req.body.usercode) {
                User.findOne({
                    usercode: req.body.usercode
                }, '-salt -password', function(err, user) {
                    if (!user) {
                        return res.json({
                            status: 'EEEE',
                            desc: '该用户不存在'
                        });
                    } else {
                        if (user.email === '') {
                            return res.json({
                                status: 'EEEE',
                                desc: '您的账号未绑定邮箱，请联系管理员重置密码'
                            });
                        } else {
                            var token = generatePassword.generate({
                                length: 6,
                                numbers: true,
                                symbols: false,
                                uppercase: true
                            });
                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 600000; // 10min

                            user.save(function(err) {
                                done(err, token, user);
                            });
                        }
                    }
                });
            } else {
                return res.json({
                    status: 'EEEE',
                    desc: '用户名不能为空'
                });
            }
        },
        function(token, user, done) {
            res.render(path.resolve('modules/User/server/templates/reset-password-email'), {
                name: user.username,
                appName: 'WebPageV5',
                token: token
            }, function(err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function(emailHTML, user, done) {
            var mailOptions = {
                from: config.mailer.from,
                to: user.email,
                subject: '重置密码',
                html: emailHTML
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if (!err) {
                    return res.json({
                        status: '0000',
                        desc: '验证码已经成功发送到您的邮箱，请注意查收'
                    });
                } else {
                    return res.json({
                        status: 'EEEE',
                        desc: '邮件发送失败',
                        err: err
                    });
                }
                done(err);
            });
        }
    ], function(err) {
        if (err) {
            return next(err);
        }
    });
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
    // Init Variables
    var passwordDetails = req.body;

    User.findOne({
        resetPasswordToken: passwordDetails.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!err && user) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                user.password = passwordDetails.newPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    if (err) {
                        return res.json({
                            status: 'EEEE',
                            desc: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        return res.json({
                            status: '0000',
                            desc: '密码重置成功'
                        });
                    }
                });
            } else {
                return res.json({
                    status: 'EEEE',
                    desc: '两次输入的密码不一样'
                });
            }
        } else {
            return res.json({
                status: 'EEEE',
                desc: '验证码无效或者已过期'
            });
        }
    });
};

/**
 * Change Password
 */
exports.change = function(req, res, next) {
    // Init Variables
    var passwordDetails = req.body;

    User.findOne({usercode: req.user.usercode}, function (err, user) {
        if (!err && user) {
            user.authenticate(passwordDetails.oldPassword, function(isMatch) {
                if (!isMatch) {
                    return res.json({
                        status: 'EEEE',
                        desc: '旧密码错误'
                    });
                } else {
                    if (passwordDetails.newPassword) {
                        if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                            user.password = passwordDetails.newPassword;

                            user.save(function(err) {
                                if (err) {
                                    return res.json({
                                        status: 'EEEE',
                                        desc: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    var token = jwt.sign({
                                        usercode: user.usercode,
                                        roles: user.roles
                                    }, config.jwtTokenSecret, {
                                        expiresIn: '2 h'
                                    });
                                    return res.json({
                                        status: '0000',
                                        data: {
                                            token: token
                                        }
                                    });
                                }
                            });
                        } else {
                            return res.json({
                                status: 'EEEE',
                                desc: '两次输入的密码不一样'
                            });
                        }
                    } else {
                        return res.json({
                            status: 'EEEE',
                            desc: '请输入新密码'
                        });
                    }
                }
            });
        } else {
            return res.json({
                status: 'EEEE',
                desc: '未找到用户'
            });
        }
    });
};
