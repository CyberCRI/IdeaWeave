'use strict';

/**
 * Module dependencies.
 */
var auth = require('../controllers/auth.controller.js');

module.exports = function(app) {

    // Setting up the auth api
    app.post('/auth/signup', auth.signup)
    app.post('/auth/login', auth.signin);

    app.post('/auth/forgotPassword', auth.forgotPassword);
    app.post('/auth/resetPassword', auth.resetPassword);

    app.post('/auth/github', auth.githubAuth);
    app.post('/auth/google', auth.googleAuth);


    //app.post('/auth/twitter',auth.twitterAuth);
    //app.post('/auth/personna',auth.personnaAuth);
};