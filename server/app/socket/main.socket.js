'use strict';

var chat = require('../controllers/chat.controller'),
    noteLab = require('../controllers/noteLab.controller'),
    mongoose = require('mongoose-q')(),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    q = require('q'),
    io =require('../../server').io;
module.exports = function(){
    io.on('connection', function (socket) {
        socket.on('init', function(userId){
            console.log("Detected WS conection for user", userId);    
            q.all([
                Project.find( { owner : userId } ).select('_id').execQ(),
                Project.find( { members : userId }).select('_id').execQ(),
                Challenge.find({ owner : userId }).select('_id').execQ()
            ]).then(function(data){
                var projects = data[0].concat(data[1]),
                    challenges = data[2];
                projects.forEach(function(project){
                    socket.join('project::'+project._id);
                });
                challenges.forEach(function(challenge){
                    socket.join('challenge::'+challenge._id);
                });
                socket.emit('rooms::ready');
            }).catch(function(err){
                socket.emit('error',err);
            });
        });

        socket.on('chat::newMessage', function (message) {
            console.log("Chat message recieved", message);                
            chat.create(message).then(function(notif){
                console.log("Sending chat message", notif);                
                socket.broadcast.emit('chat_'+message.container+'::newMessage',notif);
                socket.broadcast.emit('challenge::newMessage',notif);
                console.log("Done");                
            }).fail(function(err){
                socket.emit('error',err);
            })
        });

    });
};