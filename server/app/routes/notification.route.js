'use strict';

/**
 * Module dependencies.
 */
var notification = require('../controllers/notification.controller.js');

module.exports = function(app) {
    //CRUD
    app.get('/notification',notification.fetch);
    app.get('/notification/all',notification.fetchAll);
};