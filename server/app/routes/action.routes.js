'use strict';

/**
 * Module dependencies.
 */
var action = require('../controllers/action.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    //CRUD
    app.route('projects/:id/actions')
        .get(utils.ensureAuthenticated,action.fetch)
        .post(utils.ensureAuthenticated,action.create);
    app.route('/actions/:id')
        .get(utils.ensureAuthenticated,action.fetchOne)
        .put(utils.ensureAuthenticated,action.update)
        .delete(utils.ensureAuthenticated,action.remove);
};