'use strict';

var q = require('q'),
    mongoose = require('mongoose'),
    Notification = mongoose.model('Notification'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    Challenge= mongoose.model('Challenge'),
    Idea = mongoose.model('Idea'),
    Note = mongoose.model('NoteLab'),
    Tag = mongoose.model('Tag'),
    utils = require('../services/utils.service'),
    _ = require('lodash');

function getModelName(entityType) {
    switch (entityType) {
        case "challenge": return "Challenge";
        case "project": return "Project";
        case "profile": return "User";
        case "idea": return "Idea";
        case "note": return "NoteLab";
        case "badge": return "Badge";
        case "credit": return "Credit";
        default: throw new Error("No model name for entity type '" + entityType + "'");
    }
}

exports.populateEntity = function(notification) {
    return notification.populateQ({ 
        path: "entity", 
        model: getModelName(notification.entityType)
    });
}

exports.populateEntities = function(notifications) {
    return q.all(_.map(notifications, exports.populateEntity));
}

exports.create = function(owner,type,entity, entityType){
    var defered = q.defer(),
        myNotif = new Notification({
            owner : owner,
            type : type,
            entity : entity,
            entityType : entityType
        });
    myNotif.saveQ().then(function(notif){
        defered.resolve(notif)
    }).fail(function(err){
        defered.reject(err);
    });
    return defered.promise;
};

exports.listForUser = function(req, res) {
    // Start by finding tags that we follow
    Tag.findQ({ followers: req.user._id }, "_id")
    .then(function(followedTags) {
        var followedTagIds = _.pluck(followedTags, "_id");
        var requests = [ 
            // Find users that we are following
            User.findQ({ followers: req.user._id },'_id'), 
            // Find challenges that we follow, own, or that have our followed tags
            Challenge.findQ({ $or: [ { followers: req.user._id }, { owner: req.user._id }, { tags: { $in: followedTagIds } } ] }, '_id'),
            // Find projects that we follow, are a member of, own, or that have our followed tags
            Project.findQ({ $or: [ { followers: req.user._id }, { members: req.user._id }, { owner: req.user._id}, { tags: { $in: followedTagIds } } ] }, '_id'),
            // Find ideas that we follow, own, or that have our followed tags
            Idea.findQ({ $or: [ { owner: req.user._id }, { followers: req.user._id }, { tags: { $in: followedTagIds } } ] }, '_id'),
            // Find notes that we own or have comments that we own
            Note.findQ({ $or: [ { owner: req.user._id }, { "comment.owner": req.user._id } ] }, '_id')
        ];

        return q.all(requests);
    })
    .then(function(requestedIds) {
        // Merge the list
        var entityIds = _.pluck(_.flatten(requestedIds), "_id");
        var userIds = _.pluck(requestedIds[0], "_id");

        // Limit to 50 notifications
        return Notification.find({ $or: [ { entity: { $in: entityIds } }, { owner: { $in: userIds } } ] })
        .sort("-createDate")
        .limit(50)
        .populate("owner")
        .execQ();
    }).then(function(notifications) {
        // Populate the notification entity depending on its type
        // This requires iterating over each notification and getting a promise for its completion
        return exports.populateEntities(notifications).then(function() {
            res.json(notifications);
        });
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.getUnseenNotificationCounter = function(req, res) {
    User.findOneQ({ _id: req.user._id })
    .then(function(user) {
        res.json({
            unseenNotificationCounter: user.unseenNotificationCounter,
            lastSeenNotificationDate: user.lastSeenNotificationDate
        });
    }).fail(function(err) {
        utils.sendError(res, 500, err);
    });
};

exports.resetUnseenNotificationCounter = function(req, res) {
    User.findOneAndUpdateQ({ _id: req.user._id }, { unseenNotificationCounter: 0, lastSeenNotificationDate: Date.now() })
    .then(function() {
        res.send(200);
    })
    .fail(function(err) {
        utils.sendError(res, 500, err);
    });
};
