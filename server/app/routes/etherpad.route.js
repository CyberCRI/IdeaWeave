'use strict';

/**
 * Module dependencies.
 */
var etherpad = require("../controllers/etherpad.controller.js"),
    utils = require('../services/utils.service');

module.exports = function(app) {
    app.route('/etherpad/embedInfo')
        .get(utils.ensureAuthenticated, etherpad.getPadInfo);

    app.route('/etherpad/session')
        .get(utils.ensureAuthenticated, etherpad.getUserSessionString);
};
