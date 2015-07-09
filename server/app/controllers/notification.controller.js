'use strict';

var q = require('q'),
    mongoose = require('mongoose'),
    Notification = mongoose.model('Notification'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    Challenge= mongoose.model('Challenge'),
    Idea = mongoose.model('Idea');

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
    console.log("user id", req.user._id);

    var requests = [ 
        User.findQ({ followers:  req.user._id },'_id'), 
        Challenge.findQ({ followers: req.user._id },'_id'),
        Challenge.findQ({ owner: req.user._id},'_id'),
        Project.findQ({ followers:  req.user._id }, '_id'),
        Project.findQ({ members:  req.user._id }, '_id'),
        Project.findQ({ owner : req.user._id}, '_id'),
        Idea.findQ({ owner: req.user._id}, '_id'),
        Idea.findQ({ followers: req.user._id}, '_id')
    ];

    q.all(requests)
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
