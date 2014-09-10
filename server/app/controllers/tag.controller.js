
var mongoose = require('mongoose-q')();
var Tag = mongoose.model('Tag'),
    User = mongoose.model('User'),
    _ = require('lodash');

exports.fetchAll = function(req,res){
    Tag.findQ().then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.fetchOne = function(req,res){
    Tag.findOneQ({_id : req.query.id}).then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.create = function(req,res){
    var tag = new Tag(req.body);
;
    tag.saveQ().then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.update = function(req,res){
    Tag.updateQ().then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.remove = function(req,res){
    Tag.removeQ({_id : req.query.id}).then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(500,err);
    })
};