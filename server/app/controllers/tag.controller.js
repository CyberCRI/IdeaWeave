
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
    var tag = new Tag({ 
        title: req.body.title
    });

    tag.saveQ().then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(403,err);
    });
};
