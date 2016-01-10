'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    helmet = require('helmet'),
    consolidate = require('consolidate'),
    path = require('path');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
    // Setting application local variables
    // app.locals.title = config.app.title;
    // app.locals.description = config.app.description;
    // if (config.secure && config.secure.ssl === true) {
    //     app.locals.secure = config.secure.ssl;
    // }
    // app.locals.keywords = config.app.keywords;

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
    });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');

    // Should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));

        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Add multipart handling middleware
    // app.use(multer({
    //     dest: './uploads/',
    //     inMemory: true
    // }));
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
    // Set swig as the template engine
    app.engine('html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.engine('server.view.html', consolidate.swig);
    app.set('view engine', 'server.view.html');
    //app.set('views', './' + config.webDir);
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
   config.files.server.configs.forEach(function (configPath) {
       require(path.resolve(configPath))(app, db);
   });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
    // Use helmet to secure Express headers
    var SIX_MONTHS = 15778476000;
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
//    // Setting the app router and static folder
//    app.use('/', express.static(path.resolve('./public')));
//
//    // Globbing static routing
//    config.folders.client.forEach(function (staticPath) {
//        app.use(staticPath, express.static(path.resolve('./' + staticPath)));
//    });
    app.use(express.static(path.resolve('./public')));
    app.use(express.static(path.resolve('./' + config.webDir)));
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
    // Globbing policy files
    config.files.server.policies.forEach(function (policyPath) {
        require(path.resolve(policyPath)).invokeRolesPolicies();
    });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
    // Globbing routing files
    config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
    // Initialize express app
    var app = express();

    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Modules configuration
    this.initModulesConfiguration(app);

    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Initialize modules static client routes
    this.initModulesClientRoutes(app);

    // Initialize modules server authorization policies
    this.initModulesServerPolicies(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    return app;
};
