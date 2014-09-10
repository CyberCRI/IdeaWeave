'use strict';

/**
 * Module dependencies.
 */
var search = require('../controllers/search.controller.js');

module.exports = function(app) {
    app.get('/search/all',search.all);
};