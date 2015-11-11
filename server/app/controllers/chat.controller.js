var mongoose = require('mongoose-q')(),
    Chat = mongoose.model('Chat'),
    utils = require('../services/utils.service'),
    Notification = mongoose.model,
    q = require('q');

exports.fetchAll = function(req,res){
    Chat.findQ({ container : req.query.container }).then(function(chat){
        res.json(chat)
    }).fail(function(err){
        utils.sendError(res, 500, err);
    })
};

exports.create = function(message){
    var defered = q.defer();
    var myMessage = new Chat(message);
    myMessage.saveQ().then(function(data){
        defered.resolve(data);
    }).fail(function(err){
        defered.reject(err)
    });
    return defered.promise;
};

exports.update = function(req,res){

};

exports.remove = function(req,res){
    Chat.removeQ({ _id : req.query.id}).then(function(){
        res.json({})
    }).fail(function(err){
        utils.sendError(res, 500, err);
    })
};