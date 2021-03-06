'use strict';

var fs = require('fs'),
    q = require('q'),
    mongoose = require('mongoose-q')(),
    File = mongoose.model('File'),
    Url = mongoose.model('Url'),
    NoteLab = mongoose.model('NoteLab'),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Idea = mongoose.model('Idea'),
    Notification = mongoose.model('Notification');
    utils = require('../services/utils.service');

// NOTES

// Return if the current user is allowed to modify the given note
function canModifyNote(user, note) {
    // Cast both to strings in order to avoid ObjectID differences
    // TODO: Allow project or challenge owners to modify other's notes?
    return note.owner.toString() == user._id.toString();
}

exports.listNotes = function(req,res){
    var query;
    if(req.query.project){
        query = NoteLab.find({ project : req.query.project });
    } else if(req.query.challenge) {
        query = NoteLab.find({ challenge : req.query.challenge });
    } else if(req.query.idea) {
        query = NoteLab.find({ idea : req.query.idea });
    } else {
        return utils.sendErrorMessage(res, 403, "Please specify a project, challenge, or idea");
    }

    query.sort("-createDate").populate("owner", "username").populate("comments.owner", "username").execQ().then(function(notes){
        res.json(notes);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });

};

exports.fetchNote = function(req,res){
    NoteLab.findOne({ _id : req.params.id }).populate("owner", "username").populate("comments.owner", "username").execQ().then(function(note){
        if(!note) return res.send(400);
        res.json(note);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    })
};

exports.createNote = function(req,res){
    // Notes are attached to projects, challenges, or ideas
    var containerUpdateQuery;
    if(req.body.project){
        containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.body.project},{$inc:{noteNumber : 1}});
    } else if(req.body.challenge) {
        containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.body.challenge},{$inc:{noteNumber : 1}});
    } else if(req.body.idea) {
        containerUpdateQuery = Idea.findOneAndUpdateQ({_id:req.body.idea},{$inc:{noteNumber : 1}});
    } else {
        return utils.sendErrorMessage(res, 403, "Please specify a project, challenge, or idea");
    }

    // TODO: Check that the current user can write notes in this project or challenge (is owner or contributor)

    // Note will be owned by the current user
    req.body.owner = req.user._id; 

    var newNote = new NoteLab(req.body);
    q.all([newNote.saveQ(), containerUpdateQuery]).then(function(data) {
        var notification = new Notification({
            type : 'createNote',
            owner : req.user._id,
            entity : data[0]._id,
            entityType : 'note'
        });

        return notification.saveQ().then(function(notif){
            res.json(200, data[0]);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.updateNote = function(req,res){
    // Get the current note
    NoteLab.findOneQ({ _id : req.params.id }).then(function(note){
        if(!note) return res.send(400);
        if(!canModifyNote(req.user, note)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this note");

        // Update the text and modification date
        note.text = req.body.text;
        note.modifiedDate = new Date();
        note.increment();

        return note.saveQ().then(function(newNote) {
            var notification = new Notification({
                type : 'updateNote',
                owner : req.user._id,
                entity : req.params.id,
                entityType : 'note'
            });

            return notification.saveQ().then(function(notif){
                res.json(200, newNote);
            });
        });
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.removeNote = function(req,res){
    // Get the current note
    NoteLab.findOneQ({ _id : req.params.id }).then(function(note){
        if(!note) return res.send(400);
        if(!canModifyNote(req.user, note)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this note");

        // Notes are attached to projects or challenges
        var containerUpdateQuery;
        if(note.project){
            containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.body.project},{$dec:{noteNumber : 1}});
        } else if(note.challenge) {
            containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.body.challenge},{$dec:{noteNumber : 1}});
        } else if(note.idea) {
            ideaUpdateQuery = Idea.findOneAndUpdateQ({_id:req.body.challenge},{$dec:{noteNumber : 1}});
        } else {
            return utils.sendErrorMessage(res, 400, "Note does not specify a project, challenge, or idea");
        }

        return q.all([note.removeQ(), containerUpdateQuery]).then(function() {
            var notification = new Notification({
                type : 'removeNote',
                owner : req.user._id,
                entity : req.params.id,
                entityType : 'note'
            });

            return notification.saveQ().then(function(notif) {
                res.send(200);
            });
        });
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};


// COMMENTS

// Return if the current user is allowed to modify the given note
function canModifyComment(user, comment) {
    // Cast both to strings in order to avoid ObjectID differences
    // TODO: Allow project or challenge owners to modify other's comments?
    return comment.owner.toString() == user._id.toString();
}

exports.listComments = function(req,res){
    NoteLab.findOne({ _id : req.params.id }).populate("comments.owner", "username").execQ().then(function(note){
        if(!note) return res.send(400);

        res.json(note.comments);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.fetchComment = function(req,res){
    NoteLab.findOne({ _id : req.params.noteId }).populate("comments.owner", "username").execQ().then(function(note){
        if(!note) return res.send(400);

        var comment = note.comments.id(req.params.commentId);
        if(!comment) return res.send(400);

        res.json(comment);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.createComment = function(req,res){
    // Get note
    NoteLab.findOneQ({ _id : req.params.id }).then(function(note){
        if(!note) return res.send(400);

        // TODO: Check that the current user can comment notes in this project, challenge, or idea (is owner or contributor)

        // Comment will be owned by the current user
        var newComment = note.comments.create(req.body);
        newComment.owner = req.user._id; 

        note.comments.push(newComment);

        return note.saveQ().then(function(data) {
            // The last comment is the one we added
            var commentData = data.comments[data.comments.length - 1];

            var notification = new Notification({
                type : 'createComment',
                owner : req.user._id,
                entity : req.params.id,
                entityType : 'note'
            });

            return notification.saveQ().then(function(notif){
                res.json(200, commentData);
            });
        });
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.updateComment = function(req,res){
    NoteLab.findOneQ({ _id : req.params.noteId }).then(function(note){
        if(!note) return res.send(400);

        var comment = note.comments.id(req.params.commentId);
        if(!comment) return res.send(400);
        if(!canModifyComment(req.user, comment)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this comment");

        // Update the text and modification date
        comment.text = req.body.text;
        comment.modifiedDate = new Date();

        return note.saveQ().then(function(data) {
            // Get the comment we modified
            var commentData = data.comments.id(req.params.commentId);

            var notification = new Notification({
                type : 'updateComment',
                owner : req.user._id,
                entity : req.params.noteId,
                entityType : 'note'
            });

            return notification.saveQ().then(function(notif){
                res.json(200, commentData);
            });
        });
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.removeComment = function(req,res){
    NoteLab.findOneQ({ _id : req.params.noteId }).then(function(note){
        if(!note) return res.send(400);

        var comment = note.comments.id(req.params.commentId);
        if(!comment) return res.send(400);
        if(!canModifyComment(req.user, comment)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this comment");

        comment.remove();

        return note.saveQ().then(function(data) {
            var notification = new Notification({
                type : 'removeComment',
                owner : req.user._id,
                entity : req.params.noteId,
                entityType : 'note'
            });

            return notification.saveQ().then(function(notif){
                res.send(200);
            });
        });
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

