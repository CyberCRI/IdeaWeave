/**
 * Module dependencies
 */
var mongoose = require('mongoose-q')(),
    Badge = mongoose.model('Badge'),
    Credit = mongoose.model('Credit'),
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

// Returns promise for an entity for if the given entity exists
function getEntity(entityId, entityType) {
    var model = mongoose.model(getModelName(entityType));
    return model.findOneQ({ _id: entityId }).then(function(entity) {
        return entity;
    });
}

// Returns promise that will populate the badge earned fields
function populateCredit(credit) {
    var givenByReq = credit.populateQ({ path: "givenByEntity", model: getModelName(credit.givenByType) });
    var givenToReq = credit.populateQ({ path: "givenToEntity", model: getModelName(credit.givenToType) });

    return credit.populateQ("badge")
    .then(function() { 
        return q.all([givenByReq, givenToReq]);
    }).then(function() {
        return credit;
    });
}

function populateCredits(credits) {
    return q.all(_.map(credits, populateCredit))
    .then(function() {
        return credits; 
    });
}

exports.list = function(req, res) {
    var filter = _.pick(req.query, ["owner", "title"]);

    Badge.findQ(filter)
    .then(function(badges) {
        res.json(badges);
    }).fail(function(err) {
        utils.sendError(res, 500, err);
    });
};

exports.fetchOne = function(req, res) {
    Badge.findOneQ({_id : req.params.id})
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

        // TODO: Can only remove badges that don't have credit attached

        return Badge.removeQ({_id : req.params.id})
        .then(function() {
            res.json(200);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.listCredits = function(req, res) {
    var filter = _.pick(req.query, ["badge", "givenByEntity", "givenByType", "givenToEntity", "givenToType"]);

    Credit
    .findQ(filter)
    .then(populateCredits) 
    .then(function(credits) {
        res.json(credits);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.createCredit = function(req, res) {
    Badge.findOneQ({_id : req.body.badge})
    .then(function(badge) {
        if(!badge) return utils.sendErrorMessage(res, 400, "This badge does not exist");

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
                if(!challengeController.canModifyChallenge(req.user, referencedEntities[0]))
                    return utils.sendErrorMessage(res, 400, "You cannot give a badge for this challenge");
            } else if(req.body.givenByType == "project") {
                if(!projectController.canModifyProject(req.user, referencedEntities))
                    return utils.sendErrorMessage(res, 400, "You cannot give a badge for this project");
            } else {
                return utils.sendErrorMessage(res, 400, "This entity cannot give badges");
            }

            // Keep track of new badges to earn (needed for notifications later)
            var newCredits = [new Credit(req.body)];

            // Give badges to owners and members of projects or ideas
            if(req.body.givenToType == "project") {
                // Give badges to owner
                newCredits.push(new Credit(_.extend({}, req.body, {
                    givenToType: "profile",
                    givenToEntity: referencedEntities[1].owner
                })));

                // Give badges to members
                _.each(referencedEntities[1].members, function(member) { 
                    newCredits.push(new Credit(_.extend({}, req.body, {
                        givenToType: "profile",
                        givenToEntity: referencedEntities[1].owner
                    })));
                });
            } else if(req.body.givenToType == "idea") {
                // Give badges to owner
                newCredits.push(new Credit(_.extend({}, req.body, {
                    givenToType: "profile",
                    givenToEntity: referencedEntities[1].owner
                })));
            } else if(req.body.givenToType == "profile") {
                // No extra badges to give
            } else {
                return utils.sendErrorMessage(res, 400, "Tou cannot give a badge to this entity");
            }

            // Save the new credit 
            var createCreditRequests = _.map(newCredits, function(credit) {
                return credit.saveQ();
            });

            return q.all(createCreditRequests)
            .then(function() {
                // Create notifications for all badges received by users
                var notificationPromises = _.chain(newCredits)
                .where({ givenToType: "profile"})
                .map(function(credit) {
                    var myNotif = new Notification({
                        type: 'receive',
                        owner: credit.givenToEntity,
                        entity: credit._id,
                        entityType: 'credit'
                    });
                    
                    return myNotif.saveQ();
                }).value();

                return q.all(notificationPromises);
            }).then(function() {
                res.json(newCredits);
            });
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.fetchOneCredit = function(req, res) {
    Credit.findOneQ({_id : req.params.id})
    .then(populateCredit)
    .then(function(credit) {
        res.json(credit);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

