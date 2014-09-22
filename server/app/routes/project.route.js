'use strict';

/**
 * Module dependencies.
 */
var project = require('../controllers/project.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    //CRUD
    app.route('/projects')
        .get(project.fetch)
        .post(utils.ensureAuthenticated,project.create);

    app.route('/projects/:id')
        .get(utils.ensureAuthenticated,project.fetchOne)
        .put(utils.ensureAuthenticated,project.update)
        .delete(utils.ensureAuthenticated,project.remove);

    app.post('/project/follow',utils.ensureAuthenticated,project.follow);
    app.post('/project/unfollow',utils.ensureAuthenticated,project.unfollow);

    app.get('/projects/challenge/:challenge',project.getByChallenge);

    app.route('/project/team/apply')
        .post(utils.ensureAuthenticated,project.apply)
        .get(utils.ensureAuthenticated,project.fetchApply);
    app.put('/project/apply/:id',utils.ensureAuthenticated,project.finishApply);

    app.put('/project/add/:id',utils.ensureAuthenticated,project.addToTeam);
    app.put('/project/ban/:id',utils.ensureAuthenticated,project.banFromTeam);

    app.get('/project/urls/:id',project.getUrls);
    app.get('/project/files/:id',project.getFiles);

    app.get('/projects/tag/:tag',project.getByTag);

};