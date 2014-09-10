'use strict';

/**
 * Module dependencies.
 */
var noteLab = require('../controllers/noteLab.controller.js'),
    hackPad = require('../controllers/hackPad.controller.js'),
    utils = require('../services/utils.service');

module.exports = function(app) {
    //CRUD

    app.route('/note')
        .get(noteLab.fetchNote)
        .post(utils.ensureAuthenticated,noteLab.createNote)
        .put(utils.ensureAuthenticated,noteLab.updateNote)
        .delete(utils.ensureAuthenticated,noteLab.removeNote);

    app.route('/note/:id/comments')
        .get(noteLab.fetchComment)
        .post(utils.ensureAuthenticated,noteLab.createComment);
//        .put(noteLab.updateComment)
//        .delete(noteLab.removeComment);

    app.route('/upload')
        .get(noteLab.fetchFile)
        .post(utils.ensureAuthenticated,noteLab.upload)
        .put(utils.ensureAuthenticated,noteLab.updateFile)
        .delete(utils.ensureAuthenticated,noteLab.removeFile);

    app.route('/note/:id/url')
        .get(noteLab.fetchUrl)
        .post(utils.ensureAuthenticated,noteLab.createUrl);
//        .put(utils.ensureAuthenticated,noteLab.updateUrl)
//        .delete(utils.ensureAuthenticated,noteLab.removeUrl);

    app.route('/note/hackpad/:id')
        .get(utils.ensureAuthenticated,hackPad.getContent);
};