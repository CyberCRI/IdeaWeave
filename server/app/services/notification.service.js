'use strict';

var mongoose = require('mongoose-q')(),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Notification = mongoose.model('Notification'),
    Note = mongoose.model('NoteLab'),
    User = mongoose.model('User'),
    Idea = mongoose.model('Idea'),
    socket = require('../socket/main.socket.js'),
    q = require('q'),
    _ = require('lodash');

// Returns a promise
function getUserIdsToNotify(notification) {
    switch(notification.entityType) {
        case "project":
            return Project.findOneQ({ _id: notification.entity })
            .then(function(project) {
                return [project.owner.toString()].concat(toStringArray(project.members)).concat(toStringArray(project.followers));
            });
        case "challenge": 
            return Challenge.findOneQ({ _id: notification.entity })
            .then(function(challenge) {
                return [challenge.owner.toString()].concat(toStringArray(challenge.followers));
            });
        case "idea": 
            return Idea.findOneQ({ _id: notification.entity })
            .then(function(idea) {
                return [idea.owner.toString()].concat(toStringArray(idea.followers));
            });
        case "profile": 
            return User.findOneQ({ _id: notification.entity })
            .then(function(user) {
                return [user.id.toString()].concat(toStringArray(user.followers));
            });
        case "note": 
            return Note.findOneQ({ _id: notification.entity })
            .then(function(note) {
                var commentOwners = _.map(note.comments, function(comment) { return comment.owner.toString() });
                return [note.owner.toString()].concat(commentOwners);
            });
        default:
            throw new Error("Unknown notification type");
    }
}

function toStringArray(documentArray) {
    return _.map(documentArray, function(doc) { return doc.toString() });
}

function cleanUpUserIds(notificationOwnerId, userIds) {
    return _.chain(userIds).sortBy().uniq(true).without(notificationOwnerId).value();
}

function sendNotification(notification) {
    // Send around to only those interested
    getUserIdsToNotify(notification)
    .then(function(userIds) {
        console.log("User IDs", userIds, "owner", notification.owner);
        var cleanUserIds = cleanUpUserIds(notification.owner.toString(), userIds);
        console.log("Sending notification to users", cleanUserIds);

        _.forEach(cleanUserIds, function(userId) {
            if(!socket.isConnected(userId)) {
                console.log("User", userId, "is not connected")
            } else {
                socket.sendNotification(notification, userId);
            }
        });
    })
    .fail(function(err) {
        console.error("Cannot send notification", err);
    });
}

console.log("Notifications LOADED !!!!!");

Notification.schema.post("save", sendNotification);