'use strict';

/**
 * Module dependencies.
 */
var notification = require('../controllers/notification.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    app.route('/notifications/me')
        .get(utils.ensureAuthenticated, notification.listForUser);
};