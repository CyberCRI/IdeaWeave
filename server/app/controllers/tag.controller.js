
var mongoose = require('mongoose-q')();
var Tag = mongoose.model('Tag'),
    User = mongoose.model('User'),
    Notification = mongoose.model('Notification'),
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

exports.follow = function(req,res){
    Tag.findOneAndUpdateQ({ _id : req.params.id }, { $push : { followers : req.user._id }}).then(function(tag){
        var myNotif =  new Notification({
            type : 'follow',
            owner : req.params.id,
            entity : tag._id,
            entityType : 'tag'
        });
        return myNotif.saveQ().then(function(){
            res.json(tag)
        });
    }).fail(function(err){
        console.error("can't follow", err);
        res.json(400,err)
    });
};

exports.unfollow = function(req,res){
    Tag.findOneAndUpdateQ({ _id : req.params.id }, { $pull : { followers : req.user._id }}).then(function(tag){
        var myNotif =  new Notification({
            type : 'unfollow',
            owner : req.params.id,
            entity : tag._id,
            entityType : 'tag'
        });
        return myNotif.saveQ().then(function(){
            res.json(tag)
        });
    }).fail(function(err){
        res.json(400,err)
    });
};

exports.listFollowing = function(req,res){
    Tag.find({ followers: req.user._id }, "_id createDate title number")
    .sort("title")
    .execQ()
    .then(function(tags){
        console.log("found tags", tags.length);
        res.json(tags);
    }).fail(function(err){
        console.error("found tag error", err);
        res.json(400, err)
    });
};
