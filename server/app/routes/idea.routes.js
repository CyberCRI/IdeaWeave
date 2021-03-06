'use strict'

/**
 * Module dependencies
 */
var idea = require('../controllers/idea.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    app.route('/ideas')
        .get(idea.fetch)
        .post(utils.ensureAuthenticated, idea.create);
    
    app.get('/ideas/popular', utils.ensureAuthenticated, idea.popularIdeas);

    app.get('/ideas/:id/tags', idea.tagList);

    app.route('/ideas/:id')
        .get(idea.fetchOne)
        .put(utils.ensureAuthenticated, idea.update)
        .delete(utils.ensureAuthenticated, idea.remove);
    
    app.get('/ideas/tag/:tag', idea.getByTag);

    app.post('/ideas/:id/follow', utils.ensureAuthenticated, idea.follow);
    app.post('/ideas/:id/unfollow', utils.ensureAuthenticated, idea.unfollow);
    
    app.route('/ideas/:id/like')
        .get(idea.getLikes)
        .put(utils.ensureAuthenticated, idea.like)
        .delete(utils.ensureAuthenticated, idea.deleteLike);
    app.route('/ideas/:id/dislike')
        .get(idea.getDislikes)
        .put(utils.ensureAuthenticated, idea.dislike);
    app.get('/ideas/:id/ratings', idea.getRatings);

    app.route("/ideas/:id/link")
        .post(utils.ensureAuthenticated, idea.createLink)
        .delete(utils.ensureAuthenticated, idea.removeLink);
};