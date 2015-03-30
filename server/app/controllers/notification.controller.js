'use strict';

var q = require('q'),
    mongoose = require('mongoose'),
    Notification = mongoose.model('Notification');

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

exports.fetch = function(req,res){

};

exports.fetchAll = function(req,res){

};