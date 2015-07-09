'use strict';

var chat = require('../controllers/chat.controller'),
    noteLab = require('../controllers/noteLab.controller'),
    mongoose = require('mongoose-q')(),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Notification = mongoose.model('Notification'),
    Note = mongoose.model('NoteLab'),
    User = mongoose.model('User'),
    Idea = mongoose.model('Idea'),
    q = require('q'),
    io = require('../../server').io,
    _ = require('lodash');

// Stores map from user IDs (in DB) to array of socket IDs (defined by socket.io)
var userIdToSocketIds = {};
// Stores map from socket ID (defined by socket.io) to user ID (defined by DB)
var socketIdToUserId = {};

module.exports = function(){
    io.on('connection', function (socket) {
        socket.on('init', function(userId){
            console.log("Connected socket", socket.id, "for user", userId);

            socketIdToUserId[socket.id] = userId;

            // Create an array if necessary
            if(!userIdToSocketIds.hasOwnProperty(userId)) {
                userIdToSocketIds[userId] = [];
            }
            userIdToSocketIds[userId].push(socket.id);
        });

        socket.on('disconnect', function() {
            var userId = socketIdToUserId[socket.id];
            console.log("Disconnected socket", socket.id, "for user", userId);

            delete socketIdToUserId[socket.id];

            // Remove socket ID and clean up empty array if necessary
            _.pull(userIdToSocketIds[userId], socket.id);
            if(userIdToSocketIds[userId].length == 0) delete userIdToSocketIds[userId];
        });
    });
};

// Returns a promise
function getUserIdsToNotify(notification) {
    switch(notification.entityType) {
        case "project":
            return Project.findOneQ({ _id: notification.entity })
            .then(function(project) {
                return [project.owner].concat(project.members).concat(project.followers);
            });
        case "challenge": 
            return Challenge.findOneQ({ _id: notification.entity })
            .then(function(challenge) {
                return [challenge.owner].concat(challenge.followers);
            });
        case "idea": 
            return Idea.findOneQ({ _id: notification.entity })
            .then(function(idea) {
                return [idea.owner].concat(idea.followers);
            });
        case "profile": 
            return User.findOneQ({ _id: notification.entity })
            .then(function(user) {
                return [user._id].concat(user.followers);
            });
        case "note": 
            return Note.findOneQ({ _id: notification.entity })
            .then(function(note) {
                return [note.owner].concat(_.pluck(note.comments, "owner"));
            });
        default:
            throw new Error("Unknown notification type");
    }
}

function cleanUpUserIds(notification, userIds) {
    return _.chain(userIds).sortBy().uniq(true).without(notification.owner).value();
}

function sendNotification(notification) {
    // Send around to only those interested
    getUserIdsToNotify(notification)
    .then(function(userIds) {
        console.log("User IDs", userIds, "owner", notification.owner);
        var cleanUserIds = cleanUpUserIds(notification, userIds);
        console.log("Sending notification to users", cleanUserIds);

        _.forEach(cleanUserIds, function(userId) {
            if(!userIdToSocketIds.hasOwnProperty(userId)) {
                console.log("User", userId, "is not connected")
            } else {
                var socketIds = userIdToSocketIds[userId];
                console.log("Sending notification to sockets", socketIds);
                _.forEach(socketIds, function(socketId) {
                    io.sockets.to(socketId).emit('notification', notification);
                });
            }
        });
    })
    .fail(function(err) {
        console.error("Cannot send notification", err);
    });
}

Notification.schema.post("save", sendNotification);
