'use strict';

/**
 * Module dependencies.
 */
var users = require('../controllers/auth.controller.js');

module.exports = function(app) {

	// Setting up the auth api
    app.post('/auth/signup',users.signup)
	app.route('/auth/login').post(users.signin);
	app.route('/auth/signout').get(users.signout);
    app.post('/auth/github',users.githubAuth);
    app.post('/auth/twitter',users.twitterAuth);
    app.post('/auth/google',users.googleAuth)
    app.post('/auth/personna',users.personnaAuth)

};