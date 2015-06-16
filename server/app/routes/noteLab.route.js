'use strict';

/**
 * Module dependencies.
 */
var noteLab = require('../controllers/noteLab.controller.js'),
    hackPad = require('../controllers/hackPad.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    app.route('/notes')
        .get(noteLab.listNotes)
        .post(utils.ensureAuthenticated,noteLab.createNote);

    app.route('/notes/:id')
        .get(noteLab.fetchNote)
        .put(utils.ensureAuthenticated,noteLab.updateNote)
        .delete(utils.ensureAuthenticated,noteLab.removeNote);

    app.route('/notes/:id/comments')
        .get(noteLab.listComments)
        .post(utils.ensureAuthenticated,noteLab.createComment);

    app.route('/notes/:noteId/comments/:commentId')
        .get(noteLab.fetchComment)
        .put(utils.ensureAuthenticated,noteLab.updateComment)
        .delete(utils.ensureAuthenticated,noteLab.removeComment);
};