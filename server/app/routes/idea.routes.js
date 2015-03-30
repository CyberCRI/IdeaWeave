'use strict'

/**
 * Module dependencies
 */
var idea = require('../controllers/idea.controller.js'),
	utils = require('../services/utils.service');

module.exports = function(app) {
	app.route('/ideas')
		.get(idea.fetch)
		.post(utils.ensureAuthenticated, idea.create);
	app.route('/ideas/:id')
		.get(idea.fetchOne)
		.put(utils.ensureAuthenticated, idea.update)
		.delete(utils.ensureAuthenticated, idea.remove);
	app.put('/ideas/:id/follow', utils.ensureAuthenticated, idea.follow);
};