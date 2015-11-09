'use strict'

/**
 * Module dependencies
 */
var badge = require('../controllers/badge.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    app.route('/badges')
        .get(badge.list)
        .post(utils.ensureAuthenticated, badge.create);
    
    app.route('/badges/:id')
        .get(badge.fetchOne)
        .put(utils.ensureAuthenticated, badge.update)
        .delete(utils.ensureAuthenticated, badge.remove);

    app.route('/badges/:badgeId/earned')
        .get(badge.listEarned)
        .post(utils.ensureAuthenticated, badge.addEarned);

    app.route('/badges/:badgeId/earned/:earnedId')
        .get(badge.fetchOneEarned);
};
