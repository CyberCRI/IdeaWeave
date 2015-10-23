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
    _ = require('lodash');

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

        var entityNotificationReq = Notification.findQ({ entity: { $in: entityIds } });
        var ownerNotificationReq = Notification.findQ({ owner: { $in: userIds } });

        return q.all([entityNotificationReq, ownerNotificationReq]);
    }).then(function(requestedNotifications) {
        // Remove duplicates (based on ID). Reverse sort by date
        var allNotifications = _.chain(requestedNotifications)
            .flatten(true)
            .unique(false, function(notification) { return notification._id; })
            .sortBy(function(notification) { return new Date(notification.createDate).getTime() * -1; })
            .value();
        res.json(allNotifications);
    }).fail(function(err){
        console.error(err);
        res.json(500, err);
    });
};
