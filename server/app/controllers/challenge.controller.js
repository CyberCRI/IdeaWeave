var mongoose = require('mongoose-q')(),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Tags = mongoose.model('Tag'),
    Notification = mongoose.model('Notification'),
    Template = mongoose.model('Template'),
    tagController = require('./tag.controller'),
    io = require('../../server').io,
    utils = require('../services/utils.service'),
    _ = require('lodash'),
    q = require('q');

function canModifyChallenge(user, challenge) {
    return user._id.toString() == challenge.owner.toString();
};

exports.createTemplate = function(req,res){
    Challenge.findOneQ({ _id: req.params.id }).then(function(challenge) {
        if(!canModifyChallenge(req.user, challenge)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this challenge");

        req.body.challenge = req.params.id;
        var template = new Template(req.body);
        return template.saveQ().then(function(data){
            res.json(data);
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.getTemplates = function(req,res){
    Template.findQ({challenge : req.params.id}).then(function(data){
        res.json(data);
    }).fail(function(err){
        utils.sendError(res, 400, err);
    })
};

exports.getTemplate = function(req,res){
    Template.findOneQ({template : req.params.templateId}).then(function(data){
        res.json(data);
    }).fail(function(err){
        utils.sendError(res, 400, err);
    })
};

exports.replaceTemplate = function(req,res){
    Template.findOneQ({ _id: req.params.templateId }).then(function(template) {
        return Challenge.findOneQ({ _id: template.challenge }).then(function(challenge) {
            if(!canModifyChallenge(req.user, challenge)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this challenge");

            _.extend(template, _.omit(req.body, ["createDate", "challenge"]));
            return template.saveQ();
        });
    }).then(function(data){
        res.json(data);
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.deleteTemplate = function(req,res){
    Template.findOneQ({ _id: req.params.templateId }).then(function(template) {
        return Challenge.findOneQ({ _id: template.challenge }).then(function(challenge) {
            if(!canModifyChallenge(req.user, challenge)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this challenge");

            return Template.removeQ({ _id: req.params.templateId });
        });
    }).then(function(data){
        res.status(200).send();
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.getByTag = function(req,res){
    function completeQuery(query) {
        query.limit(req.query.limit)
            .skip(req.query.skip)
            .select('_id createDate accessUrl title brief owner tags followers projects poster')
            .sort('-createDate')
            .populate('tags')
            .sort('-createDate')
            .execQ().then(function(challenges) {
                res.json(challenges);
            }).fail(function (err){
                utils.sendError(res, 400, err);
            });
    }

    if(req.params.tag == 'all'){
        completeQuery(Challenge.find());
    } else{
        Tags.findQ({ title : req.params.tag }).then(function (tag) {
            completeQuery(Challenge.find({ tags : tag[0]._id }));
        });
    }
};

exports.follow = function(req,res){
    Challenge.findOneAndUpdateQ({ _id : req.body.following },{$addToSet : { followers : req.body.follower }}).then(function(challenge){
        var myNotif =  new Notification({
            type : 'follow',
            owner : req.body.follower,
            entity : challenge._id,
            entityType : 'challenge'
        });
        myNotif.saveQ().then(function(){
            res.json(challenge);
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    })
};

exports.unfollow = function(req,res){
    Challenge.findOneAndUpdateQ({ _id : req.body.following },{$pull : { followers : req.body.follower }}).then(function(challenge){
        var myNotif = new Notification({
            type : 'unfollow',
            owner : req.body.follower,
            entity : challenge._id,
            entityType : 'challenge'
        });
        myNotif.saveQ().then(function() {
            res.json(challenge);
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    })
};

exports.fetch = function(req,res){
    if(req.query.accessUrl) {
        if(req.query.accessUrl){
            Challenge
                .find({accessUrl : req.query.accessUrl})
                .populate('tags')
                .populate('followers')
                .populate('owner')
                .exec(function(err,challenge){

                    if(err){
                        utils.sendError(res, 400, err);
                    }
                    res.json(challenge);
                });
        }
    }else if(req.query._id) {
            switch(req.query.type){
                case 'card':
                    Challenge.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers startDate endDate projects owner likers').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        utils.sendError(res, 400, err);
                    })
                    break;
                case 'info':
                    Challenge.find({_id : req.query._id}).select('_id title accessUrl').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        utils.sendError(res, 400, err);
                    });
                    break;
                case 'block':
                    Challenge.find({_id : req.query._id}).select('_id title accessUrl poster').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        utils.sendError(res, 400, err);
                    });
                    break;
                default:
                    Challenge.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers owner home showProgress progress like dislike').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        utils.sendError(res, 400, err);
                    });
                    break;
            }

    }else{
        Challenge.find().populate('tags').select('-banner').execQ().then(function (challenges) {
            res.json(challenges);
        }).fail(function (err) {
            utils.sendError(res, 400, err);
        })
    }
};

exports.create = function(req,res){
    if(req.body.tags) {
        req.body.tags = _.pluck(req.body.tags, "_id");
    }

    req.body.owner = req.user._id;
    var challenge = new Challenge(req.body);

    return challenge.saveQ().then(function(data){
        var myNotif =  new Notification({
            type : 'create',
            owner : req.user._id,
            entity : data._id,
            entityType : 'challenge'
        });
        return myNotif.saveQ().then(function() {
            return tagController.updateTagCounts("challenge", challenge.tags, []);
        }).then(function() {
            res.json(data);
        }).fail(function(err) {
            utils.sendError(res, 500, err);
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.update = function(req,res){
    Challenge.findOneQ({ _id: req.params.id }).then(function(challenge) {
        if(!canModifyChallenge(req.user, challenge)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this challenge");

        var updateObj = _.pick(req.body, ["brief", "webPage", "startDate", "EndDate", "localisation", "banner", "home", "showProgress", "progress", "tags"]);

        return Challenge.findOneAndUpdateQ({ _id : req.params.id }, updateObj).then(function(data){
            return tagController.updateTagCounts("challenge", data.tags, challenge.tags).then(function() {
                var myNotif = new Notification({
                    type : 'update',
                    owner : req.user._id,
                    entity : data._id,
                    entityType : 'challenge'
                });
                return myNotif.saveQ().then(function() {
                    res.json(data);
                });
            });
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    })
};

exports.remove = function(req,res){
    Challenge.findOneQ({ _id: req.params.id }).then(function(challenge) {
        if(!canModifyChallenge(req.user, challenge)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this challenge");

        var projectUpdateQuery = Project.updateQ({ container: req.params.id }, { container: null });
        var challengeRemovalQuery = Challenge.findOneAndRemoveQ({_id : req.params.id});
        var updateTagCountsQuery = tagController.updateTagCounts("challenge", [], challenge.tags);

        return q.all([projectUpdateQuery, challengeRemovalQuery, updateTagCountsQuery]).then(function(data){
            var myNotif = new Notification({
                type : 'remove',
                owner : req.user._id,
                entity : req.params.id,
                entityType : 'challenge'
            });
            return myNotif.saveQ().then(function() {
                res.json(data);
            });
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    })
};

exports.like = function(req, res) {
    Challenge.findOneAndUpdateQ({ _id : req.params.challengeId },{$addToSet : { likers : req.user._id }}).then(function(challenge){
        var myNotif =  new Notification({
            type : 'like',
            owner : req.user._id,
            entity : challenge._id,
            entityType : 'challenge'
        });
        return myNotif.saveQ().then(function(){
            res.json(challenge)
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
}

exports.unlike = function(req, res) {
    Challenge.findOneAndUpdateQ({ _id : req.params.challengeId },{$pull : { likers : req.user._id }}).then(function(challenge){
        var myNotif =  new Notification({
            type : 'unlike',
            owner : req.user._id,
            entity : challenge._id,
            entityType : 'challenge'
        });
        return myNotif.saveQ().then(function(){
            res.json(challenge)
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
}
