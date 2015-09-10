
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

// Returns promise to update tags 
exports.updateTagCounts = function(newTagIds, oldTagIds) {
    // Convert IDs to strings
    newTagIds = _.map(newTagIds, function(tagId) { return tagId.toString(); });
    oldTagIds = _.map(oldTagIds, function(tagId) { return tagId.toString(); });

    var tagsToAdd = _.difference(newTagIds, oldTagIds);
    var tagsToRemove = _.difference(oldTagIds, newTagIds);

    console.log("Adding tags", tagsToAdd, "and removing", tagsToRemove);

    var incrementQueries = _.map(tagsToAdd, function(tagId) {
        return Tag.updateQ({ _id : tagId },{ $inc : {number : 1} });
    });
    var decrementQueries = _.map(tagsToRemove, function(tagId) {
        return Tag.updateQ({ _id : tagId },{ $inc : {number : -1} });
    });
    
    return q.all(_.flatten([incrementQueries, decrementQueries]));
};
