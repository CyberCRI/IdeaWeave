#!/usr/bin/env node
'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose-q')(),
    path = require('path'),
    socket = require('./app/socket/main.socket');


// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the express application
var app = require('./config/express')(db);

// Init socket.io
var server = require('http').Server(app);
var socketIo = require('socket.io')(server);
socket.init(socketIo);

// Load notification service after sockets and models
require('./app/services/notification.service')

//require all routes
config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
});


// Start the app by listening on <port>
server.listen(config.port);

// Expose app
exports.app = app;

// Logging initialization
console.log('IdeaWeave API started on port ' + config.port);