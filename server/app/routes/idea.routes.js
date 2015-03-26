'use strict'

/**
 * Module dependencies
 */
var idea = require('../controllers/idea.controller.js'),
	utils = require('../services/utils.service');

module.exports = function(app) {
	app.route('/ideas')
		.get(idea.fetch)
		.post(idea.create);
	app.route('/idea/:id')
		.delete(utils.ensureAuthenticated, idea.remove);
};