'use strict';

/**
 * Module dependencies.
 */
var chat = require('../controllers/chat.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    //CRUD
    app.route('/chat')
        .put(utils.ensureAuthenticated,chat.update)
        .get(chat.fetchAll)
        .post(utils.ensureAuthenticated,chat.create)
        .delete(utils.ensureAuthenticated,chat.remove);
};