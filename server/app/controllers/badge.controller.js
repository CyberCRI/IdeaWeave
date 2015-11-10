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
    projectController = require('../controllers/project.controller.js'),
    challengeController = require('../controllers/challenge.controller.js'),
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
}

// Like Mongoose populateQ(), but without required a document
function populateField(parent, fieldName, entityType) {
    var model = mongoose.model(getModelName(entityType));
    return model.findOneQ({ _id: parent[fieldName] }).then(function(entity) {
        parent[fieldName] = entity;
    });
}

// Returns promise for an entity for if the given entity exists
function getEntity(entityId, entityType) {
    var model = mongoose.model(getModelName(entityType));
    return model.findOneQ({ _id: entityId }).then(function(entity) {
        return entity;
    });
}

// Returns promise that will populate the badge earned fields
function populateBadgeEarned(badgeEarned) {
    var givenByReq = populateField(badgeEarned, "givenByEntity", badgeEarned.givenByType);
    var givenToReq = populateField(badgeEarned, "givenToEntity", badgeEarned.givenToType);

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
    .then(function(badges) {
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
        if(!badge) return utils.sendMissingError(res);

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
        if(!badge) return utils.sendMissingError(res);
        
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
        if(!badge) return utils.sendMissingError(res);

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
    .then(function(badge) { 
        if(!badge) return utils.sendMissingError(res);

        // Convert badge to a regular JS object, or we can't populate the data correctly
        badge = badge.toObject();

        return populateEarned(badge)
        .then(function(badge) {
            res.json(badge.earned);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.addEarned = function(req, res) {
    Badge
    .findOne({_id : req.params.badgeId})
    .execQ()
    .then(function(badge) {
        if(!badge) return utils.sendMissingError(res);

        // Check that referenced entity exists
        var referencedEntityRequests = [
            getEntity(req.body.givenByEntity, req.body.givenByType),
            getEntity(req.body.givenToEntity, req.body.givenToType)
        ];
        return q.all(referencedEntityRequests)
        .then(function(referencedEntities) { 
            if(!referencedEntities[0] || !referencedEntities[1]) return utils.sendMissingError(res);

            // Check that you can add earned (must be owner of project or challenge that is giving)
            if(req.body.givenByType == "challenge") {
                if(challengeController.canModifyChallenge(req.user, referencedEntities[0]))
                    return utils.sendErrorMessage(res, 400, "You cannot give a badge for this challenge");
            } else if(req.body.givenByType == "project") {
                if(projectController.canModifyProject(req.user, referencedEntities))
                    return utils.sendErrorMessage(res, 400, "You cannot give a badge for this project");
            } else {
                return utils.sendErrorMessage(res, 400, "This entity cannot give badges");
            }

            // Keep track of new badges to earn (needed for notifications later)
            var newEarned = [req.body];

            // Give badges to owners and members of projects or ideas
            if(req.body.givenToType == "project") {
                // Give badges to owner
                newEarned.push(_.extend({}, req.body, {
                    givenToType: "profile",
                    givenToEntity: referencedEntities[1].owner
                }));

                // Give badges to members
                _.each(referencedEntities[1].members, function(member) { 
                    newEarned.push(_.extend({}, req.body, {
                        givenToType: "profile",
                        givenToEntity: referencedEntities[1].owner
                    }));
                });
            } else if(req.body.givenToType == "idea") {
                // Give badges to owner
                newEarned.push(_.extend({}, req.body, {
                    givenToType: "profile",
                    givenToEntity: referencedEntities[1].owner
                }));
            } else if(req.body.givenToType == "profile") {
                // No extra badges to give
            } else {
                return utils.sendErrorMessage(res, 400, "Tou cannot give a badge to this entity");
            }

            // Copy over new badge earnings, then save the badge
            _.each(newEarned, function(earned) {
                badge.earned.push(earned);
            });

            return badge.saveQ()
            .then(function(updatedBadge) {
                // Create notifications for all badges received by users
                var notificationPromises = _.chain(newEarned)
                .where({ givenToType: "profile"})
                .map(function(earned) {
                    var myNotif = new Notification({
                        type: 'receive',
                        owner: earned.givenToEntity,
                        entity: badge._id,
                        entityType: 'badge'
                    });
                    
                    return myNotif.saveQ()                    
                }).value();

                return q.all(notificationPromises);
            }).then(function() {
                res.json(badge.earned);
            });
        });
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
        if(!badge) return utils.sendMissingError(res);

        // Convert badge to a regular JS object, or we can't populate the data correctly
        return populateBadgeEarned(badge.earned.id(req.params.earnedId).toObject())
        .then(function(badgeEarned) {
            res.json(badgeEarned);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.listEarnedBy = function(req, res) {
    console.log("in listEarnedBy");
    Badge.findQ({ earned: { givenToEntity: req.params.entityId } })
    .then(function(badges) {
        // Take out earned records that don't concern the entity
        var trimmedBadges = _.map(badges, function(badge) {
            var badge = badge.toObject();
            badge.earned = _.where(badge.earned, { givenToEntity: req.params.entityId });
            return badge; 
        });
        res.json(trimmedBadges);
    }).fail(function(err) {
        utils.sendError(res, 500, err);
    });
};
