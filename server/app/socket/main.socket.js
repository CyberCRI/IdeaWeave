'use strict';

var q = require('q'),
    _ = require('lodash');

// Stores map from user IDs (in DB) to array of socket IDs (defined by socket.io)
var userIdToSocketIds = {};
// Stores map from socket ID (defined by socket.io) to user ID (defined by DB)
var socketIdToUserId = {};

// Set by init()
var socketIo;

module.exports.init = function(_socketIo) {
    socketIo = _socketIo;

    socketIo.on('connection', function(socket) {
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
            if(!socketIdToUserId.hasOwnProperty(socket.id)) {
                console.error("Unknown socket disconnecting", socket.id);
                return;
            }

            var userId = socketIdToUserId[socket.id];
            console.log("Disconnected socket", socket.id, "for user", userId);

            delete socketIdToUserId[socket.id];

            // Remove socket ID and clean up empty array if necessary
            _.pull(userIdToSocketIds[userId], socket.id);
            if(userIdToSocketIds[userId].length == 0) delete userIdToSocketIds[userId];
        });
    });
};

module.exports.isConnected =  function(userId) {
    return userIdToSocketIds.hasOwnProperty(userId);
}

module.exports.sendNotification =  function(notification, userId) {
    if(!userIdToSocketIds.hasOwnProperty(userId)) return;

    var socketIds = userIdToSocketIds[userId];
    console.log("Sending notification to sockets", socketIds);
    _.forEach(socketIds, function(socketId) {
        socketIo.sockets.to(socketId).emit('notification', notification);
    });
}
