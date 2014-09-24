'use strict';

/**
 * Module dependencies.
 */
var utils = require('../services/utils.service');

module.exports = function(app) {
    var Recommandation = require('../controllers/recommendation.controller.js');

    app.get('/recommendations/user/:id',utils.ensureAuthenticated,Recommandation.fetchUsers);
    app.get('/recommendations/project/:id',utils.ensureAuthenticated,Recommandation.fetchProjects);
    app.get('/recommendations/challenge/:id',utils.ensureAuthenticated,Recommandation.fetchChallenges);

    app.get('/popular',Recommandation.popular);

};