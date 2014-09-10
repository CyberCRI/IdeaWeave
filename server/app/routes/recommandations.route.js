'use strict';

/**
 * Module dependencies.
 */
var utils = require('../services/utils.service');

module.exports = function(app) {
    var Recommandation = require('../controllers/recommandation.controller.js');
    //CRUD
    app.get('/recommandations/user/:id',utils.ensureAuthenticated,Recommandation.fetchUsers);
    app.get('/recommandations/project/:id',utils.ensureAuthenticated,Recommandation.fetchProjects);
    app.get('/recommandations/challenge/:id',utils.ensureAuthenticated,Recommandation.fetchChallenges);

    app.get('/popular',Recommandation.popular);

};