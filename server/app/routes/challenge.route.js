'use strict';

/**
 * Module dependencies.
 */
var challenge = require('../controllers/challenge.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    //CRUD
    app.route('/challenges')
        .get(challenge.fetch)
        .post(utils.ensureAuthenticated,challenge.create);
    app.route('/challenges/:id')
        .put(utils.ensureAuthenticated,challenge.update)
        .delete(utils.ensureAuthenticated,challenge.remove);
    app.route('/challenge/template/:id')
        .post(utils.ensureAuthenticated,challenge.createTemplate)
        .get(utils.ensureAuthenticated,challenge.getTemplates);

    app.get('/challenges/tag/:tag',challenge.getByTag);

    app.post('/challenges/follow',utils.ensureAuthenticated,challenge.follow);
    app.post('/challenges/unfollow',utils.ensureAuthenticated,challenge.unfollow);
};