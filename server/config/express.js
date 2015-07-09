'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    helmet = require('helmet'),
    config = require('./config'),
    path = require('path'),
    multer = require('multer');

module.exports = function(db) {
    // Initialize express app
    var app = express();

    // Globbing model files
    config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
        console.log(modelPath);
        require(path.resolve(modelPath));
    });

    // Passing the request url to environment locals
    app.use(function(req, res, next) {
        res.locals.url = req.protocol + ':// ' + req.headers.host + req.url;
        next();
    });

    // Should be placed before express.static
    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Showing stack errors
    app.set('showStackError', true);



    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));

        // Disable views cache
//      app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
//  app.use(bodyParser.urlencoded());
//  app.use(bodyParser.json());
    app.use(bodyParser.json({limit: '50mb'}));
    
    // Can't use urlencoded along with json decoder?
    app.use(bodyParser.urlencoded({limit: '50mb'}));
    app.use(methodOverride());


    // use multer for file upload
    app.use(multer({
        dest: "./public"
    }));
    // Enable jsonp
    app.enable('jsonp callback');


    // Use helmet to secure Express headers
//  app.use(helmet.xframe());
//; app.use(helmet.iexss());
//  app.use(helmet.contentTypeOptions());
//  app.use(helmet.ienoopen())
    app.disable('x-powered-by');
    console.log(config)

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
//        res.header('Access-Control-Allow-Origin', config.crossOrigin);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        next();
    })

    // Setting the app router and static folder
    console.log("Serving static files from", path.resolve('public'));
    app.use("/files", express.static("public"));

    // Globbing routing files


    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
//  app.use(function(err, req, res, next) {
//      // If the error object doesn't exists
//      if (!err) return next();
//
//      // Log it
//      console.error(err.stack);
//
//      // Error page
//      res.status(500).render('500', {
//          error: err.stack
//      });
//  });

    return app;
};