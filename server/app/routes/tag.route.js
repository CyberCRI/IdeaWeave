'use strict';

/**
 * Module dependencies.
 */
var utils = require('../services/utils.service');

module.exports = function(app) {
    var Tag = require('../controllers/tag.controller.js');

    app.route('/tags')
        .get(Tag.fetchAll)
        .post(Tag.create);
    app.get('/tags/:id', Tag.fetchOne);
};