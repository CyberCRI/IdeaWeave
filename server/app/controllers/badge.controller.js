/**
 * Module dependencies
 */
var mongoose = require('mongoose-q')(),
    Badge = mongoose.model('Badge'),
    Idea = mongoose.model('Idea'),
    User = mongoose.model('User'),
    Challenge = mongoose.model('Challenge'),
    Project = mongoose.model('Project'),
    Tags = mongoose.model('Tag'),
    Notification = mongoose.model('Notification'),
    NoteLab = mongoose.model('NoteLab'),
    tagController = require('./tag.controller'),
    utils = require('../services/utils.service'),
    io = require('../../server').io,
    _ = require('lodash'),
    q = require('q');


function getModelName(entityType) {
    switch (entityType) {
        case "challenge": return "Challenge";
        case "project": return "Project";
        case "profile": return "User";
        case "idea": return "Idea";
        default: throw new Error("No model name for entity type '" + entityType + "'");
    }
}

function canModifyBadge(user, badge) {
    return user._id.toString() == badge.owner.toString();
};

// Returns promise that will populate the badge earned fields
function populateBadgeEarned(badgeEarned) {
    var givenByReq = badgeEarned.populateQ({ 
        path: "givenByEntity", 
        model: getModelName(badgeEarned.givenByEntity)
    });
    var givenToReq = badgeEarned.populateQ({ 
        path: "givenToEntity", 
        model: getModelName(badgeEarned.givenToEntity)
    });
    return q.all([givenByReq, givenToReq])
    .then(function() {
        return badgeEarned;
    });
}

function populateEarned(badge) {
    return q.all(_.map(badge.earned, populateBadgeEarned))
    .then(function() {
        return badge; 
    });
}

exports.list = function(req, res) {
    Badge
    .find()
    .select("-earned")
    .execQ()
    .then(function(ideas) {
        res.json(badges);
    }).fail(function(err) {
        utils.sendError(res, 500, err);
    });
};

exports.fetchOne = function(req, res) {
    Badge
    .findOne({_id : req.params.id})
    .select("-earned")
    .execQ()
    .then(function(badge) {
        res.json(badge);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.create = function(req, res) {
    // Idea will be owned by the current user
    req.body.owner = req.user._id; 

    req.body.earned = []; // Empty out this field

    var badge = new Badge(req.body);
    badge.saveQ().then(function(badge) {
        var myNotif = new Notification({
            type: 'create',
            owner: req.user._id,
            entity: badge._id,
            entityType: 'badge'
        });
        return myNotif.saveQ().then(function(notif) {
            res.json(badge);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.update = function(req, res) {
    Badge.findOneQ({_id : req.params.id}).then(function(badge) {
        if(!canModifyBadge(req.user, badge)) {
            return utils.sendErrorMessage(res, 403, "You are not allowed to modify this badge");
        };

        badge.title = req.body.title;
        badge.description = req.body.description;
        badge.image = req.body.image;
        
        return badge.saveQ().then(function(modifiedBadge) {
            var myNotif = new Notification({
                type: 'update',
                owner: req.user._id,
                entity: modifiedBadge._id,
                entityType: 'badge'
            });
            
            return myNotif.saveQ()
            .then(function() {
                res.json(200, modifiedBadge);
            });
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.remove = function(req, res) {
    Badge.findOneQ({_id : req.params.id}).then(function(badge) {
        if(!canModifyBadge(req.user, badge)) {
             return utils.sendErrorMessage(res, 403, "You are not allowed to modify this badge");
        };

        return Badge.removeQ({_id : req.params.id})
        .then(function() {
            res.json(200);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};


exports.listEarned = function(req, res) {
    Badge
    .findOne({_id : req.params.badgeId})
    .select("earned")
    .execQ()
    .then(populateEarned)
    .then(function(badge) {
        res.json(badge.earned);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.addEarned = function(req, res) {
    Badge
    .findOne({_id : req.params.badgeId})
    .execQ()
    .then(function(badge) {
        // TODO: check that you can add earned
        badge.earned.push(req.body);
        return badge.saveQ();
    }).then(populateEarned)
    .then(function(badge) {
        res.json(badge.earned);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.fetchOneEarned = function(req, res) {
    Badge
    .findOne({_id : req.params.badgeId})
    .select("earned")
    .execQ()
    .then(function(badge) {
        return populateBadgeEarned(badge.earned.id(req.params.earnedId));
    }).then(function(badgeEarned) {
        res.json(badge.earned.id(req.params.earnedId));
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};
