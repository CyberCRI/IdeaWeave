'use strict';

/**
 * Module dependencies.
 */
var project = require('../controllers/project.controller'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    app.route('/projects')
        .get(project.fetch)
        .post(utils.ensureAuthenticated,project.create);

   app.route('/projects/:id')
        .get(project.fetchOne)
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

    app.get('/projects/tag/:tag',project.getByTag);

    app.get('/project/publications/:id',project.getPublications);

    app.route('/project/:projectId/url')
        .get(utils.ensureAuthenticated,project.listUrls)
        .post(utils.ensureAuthenticated,project.createUrl);
    app.route('/project/:projectId/url/:urlId')
        .get(utils.ensureAuthenticated,project.fetchUrl)
        .delete(utils.ensureAuthenticated,project.removeUrl);

  app.get('/project/files/:id',project.getFiles);
  
};
