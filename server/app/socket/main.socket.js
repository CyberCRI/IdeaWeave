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
        socket.on('init',function(userId){
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
            chat.create(message).then(function(notif){
                socket.emit('chat_'+message.container+'::newMessage',notif);
                socket.broadcast.emit('challenge::newMessage',notif);
            }).fail(function(err){
                socket.emit('error',err);
            })
        });

    });
};