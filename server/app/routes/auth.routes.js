'use strict';

/**
 * Module dependencies.
 */
var users = require('../controllers/auth.controller.js');

module.exports = function(app) {

    // Setting up the auth api
    app.post('/auth/signup',users.signup)
    app.post('/auth/login', users.signin);
    app.post('/auth/forgotPassword', users.forgotPassword);

    app.post('/auth/github',users.githubAuth);
    app.post('/auth/google',users.googleAuth);


    //app.post('/auth/twitter',users.twitterAuth);
    //app.post('/auth/personna',users.personnaAuth);
};