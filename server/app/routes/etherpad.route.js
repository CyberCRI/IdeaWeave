'use strict';

/**
 * Module dependencies.
 */
var etherpad = require('../controllers/etherpad.controller'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    app.route('/etherpad/embed')
        .get(utils.ensureAuthenticated, etherpad.embed);
};
