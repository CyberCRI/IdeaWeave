'use strict';

/**
 * Module dependencies.
 */
var utils = require('../services/utils.service');
var tag = require('../controllers/tag.controller.js');

module.exports = function(app) {

    app.route('/tags')
        .get(tag.fetchAll)
        .post(tag.create);

    app.get('/tags/following', utils.ensureAuthenticated, tag.listFollowing);

    app.get('/tags/:id', tag.fetchOne);

    app.post('/tags/:id/follow', utils.ensureAuthenticated, tag.follow);
    app.post('/tags/:id/unfollow', utils.ensureAuthenticated, tag.unfollow);

};