"use strict";

var mongoose = require('mongoose-q')(),
    Action = mongoose.model('Action');

exports.fetch = function(req,res){
    Action.findQ().then(function(actions){
        res.json(actions);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.fetchOne = function(req,res){
    Action.findOneQ({ _id : req.params.id }).then(function(action){
        res.json(action);
    }).fail(function(err){
        res.json(err);
    })
};

exports.create = function(req,res){
    var action = new Action(req.body);
    action.saveQ().then(function(result){
        res.json(result);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.update = function(req,res){
    Action.findOneAndUpdateQ({ _id : req.params.id },req.body).then(function(){
        res.send(200);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.remove = function(req,res){

};