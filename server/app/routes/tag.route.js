'use strict';

/**
 * Module dependencies.
 */
var utils = require('../services/utils.service');

module.exports = function(app) {
    var Tag = require('../controllers/tag.controller.js');
    //CRUD
    app.route('/tags')
        .put(utils.ensureAuthenticated,Tag.update)
        .get(Tag.fetchAll)
        .post(Tag.create)
        .delete(utils.ensureAuthenticated,Tag.remove);
    app.get('/tags/:id',Tag.fetchOne);

};