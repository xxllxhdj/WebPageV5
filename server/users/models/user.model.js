'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    validator = require('validator'),
    owasp = require('owasp-password-strength-test');

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
    return (!this.updated || validator.isEmail(email));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        //default: '',
        validate: [validateLocalStrategyEmail, '请输入一个合法的邮箱']
    },
    usercode: {
        type: String,
        unique: '用户名已存在',
        required: '请输入用户名',
        trim: true
    },
    username: {
        type: String,
        default: '',
        trim: true
    },
    password: {
        type: String,
        default: '',
        required: '请输入密码'
    },
    salt: {
        type: String
    },
    profileImageURL: {
        type: String,
        default: 'users/img/default.png'
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user'],
        required: '请至少提供一个角色'
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

UserSchema.index({usercode: 1});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    if (this.username === '') {
        this.username = this.usercode;
    }

    next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
    if (this.password && this.isModified('password')) {
        var result = owasp.test(this.password);
        if (result.errors.length) {
            var error = result.errors.join(' ');
            this.invalidate('password', error);
        }
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password, callback) {
    callback(this.password === this.hashPassword(password));
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username.toLowerCase() + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

mongoose.model('User', UserSchema, 'User');