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

    app.route('/challenges/:id/templates')
        .get(challenge.getTemplates)
        .post(utils.ensureAuthenticated,challenge.createTemplate)
    app.route('/challenges/:challengeId/templates/:templateId')
        .get(challenge.getTemplate)
        .put(utils.ensureAuthenticated,challenge.replaceTemplate)
        .delete(utils.ensureAuthenticated,challenge.deleteTemplate)


    app.get('/challenges/tag/:tag',challenge.getByTag);

    app.post('/challenges/follow',utils.ensureAuthenticated,challenge.follow);
    app.post('/challenges/unfollow',utils.ensureAuthenticated,challenge.unfollow);
};