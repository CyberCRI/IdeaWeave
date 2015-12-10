/**
 * Module dependencies
 */
var mongoose = require('mongoose-q')(),
    Idea = mongoose.model('Idea'),
    User = mongoose.model('User'),
    Challenge = mongoose.model('Challenge'),
    Project = mongoose.model('Project'),
    Tags = mongoose.model('Tag'),
    Notification = mongoose.model('Notification'),
    NoteLab = mongoose.model('NoteLab'),
    tagController = require('./tag.controller'),
    utils = require('../services/utils.service'),
    io = require('../../server').io,
    _ = require('lodash'),
    q = require('q');

function canModifyIdea(user, idea) {
    return user._id.toString() == idea.owner.toString();
};

exports.fetchOne = function(req, res) {
    Idea.findOne({_id : req.params.id})
        .populate('tags')
        .populate('followers')
        .populate('owner')
        .execQ().then(function(idea) {
            res.json(idea);
        }).fail(function(err) {
            utils.sendError(res, 400, err);
        });
};

exports.fetch = function(req, res) {
    Idea
        .find()
        .populate('tags')
        .populate('followers')
        .populate('owner')
        .execQ()
        .then(function(idea) {
            res.json(idea);
        }).fail(function(err) {
            utils.sendError(res, 500, err);
        });
};

exports.getByTag = function(req,res){
    if(req.params.tag == 'all'){
        Idea.find().limit(req.query.limit).skip(req.query.skip).sort('-createDate').populate('tags').sort('-createDate').execQ().then(function(ideas){
            res.json(ideas);
        }).fail(function(err){
            utils.sendError(res, 400, err);
        })
    }else{
        Tags.findQ({ title : req.params.tag }).then(function(tag){
            Idea.find({ tags : tag[0]._id }).limit(req.query.limit).skip(req.query.skip).populate('tags').sort('-createDate').execQ().then(function(ideas){
                res.json(ideas);
            }).fail(function(err){
                utils.sendError(res, 400, err);
            })
        }).fail(function(err){
            utils.sendError(res, 400, err);
        })
    }
};

exports.create = function(req, res) {
    if(req.body.tags){
        req.body.tags = _.pluck(req.body.tags, "_id");
    }

    // Idea will be owned by the current user
    req.body.owner = req.user._id; 

    // Idea will have one note at start
    req.body.noteNumber = 1;

    var idea = new Idea(req.body);
    idea.saveQ().then(function(idea) {
        var myNotif = new Notification({
            type : 'create',
            owner : req.user._id,
            entity : idea._id,
            entityType : 'idea'
        });
        return myNotif.saveQ().then(function(notif) {
            // Create 1st discussion
            var newNote = new NoteLab({
                owner: req.user._id,
                idea: idea._id,
                text: idea.title
            });
            return newNote.saveQ();
        }).then(function() {
            return tagController.updateTagCounts("idea", idea.tags, []);
        }).then(function() {
            res.json(200, idea);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.update = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        if(!canModifyIdea(req.user, idea)) {
            return utils.sendErrorMessage(res, 403, "You are not allowed to modify this idea");
        };

        idea.title = req.body.title;
        idea.brief = req.body.brief;
        idea.language = req.body.language;

        var oldTags = idea.tags;
        idea.tags = req.body.tags;
        
        idea.modifiedDate = new Date();

        idea.saveQ().then(function(modifiedIdea) {
            var myNotif = new Notification({
                type : 'update',
                owner : req.user._id,
                entity : modifiedIdea._id,
                entityType : 'idea'
            });
            
            return myNotif.saveQ()
            .then(function() {
                return tagController.updateTagCounts("idea", modifiedIdea.tags, oldTags);
            }).then(function() {
                res.json(200, modifiedIdea);
            });
        }).fail(function(err) {
            utils.sendError(res, 400, err);
        });
    });
};

exports.remove = function(req, res) {
    // TODO : check that you can remove ideas
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        if(!canModifyIdea(req.user, idea)) {
             return utils.sendErrorMessage(res, 403, "You are not allowed to modify this idea");
        };

        var projectUpdates = _.map(idea.projects, function(projectId) {
            return Project.updateQ({_id: projectId},{$pull: {ideas: req.params.id}});
        });
        var challengeUpdates = _.map(idea.projects, function(challengeId) {
            return Challenge.updateQ({_id: challengeId},{$pull: {ideas: req.params.id}});
        });
        var ideaUpdate = Idea.removeQ({_id : req.params.id});

        return q.all(_.flatten([projectUpdates, challengeUpdates, ideaUpdate])).then(function() {
            var myNotif = new Notification({
                type : 'remove',
                owner : req.user._id,
                entity : req.params.id,
                entityType : 'idea'
            });
            return myNotif.saveQ()
            .then(function() {
                return tagController.updateTagCounts("idea", [], idea.tags);
            }).then(function() {
                res.json(200);
            });
        }).fail(function(err) {
            utils.sendError(res, 400, err);
        });
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.follow = function(req, res) {
    Idea.findOneAndUpdate({_id : req.params.id}, {$addToSet : {followers: req.user._id}})
        .populate("followers")
        .execQ()
        .then(function(idea) {
            var myNotif = new Notification({
                type : 'follow',
                owner : req.user._id,
                entity : idea._id,
                entityType : 'idea'
            });
            return myNotif.saveQ().then(function() {
                res.json(idea);
            });
        }).fail(function(err) {
            utils.sendError(res, 400, err);
        });
};

exports.unfollow = function(req, res) {
    Idea.findOneAndUpdate({_id : req.params.id}, {$pull : {followers: req.user._id}})
        .populate("followers")
        .execQ()
        .then(function(idea) {
            var myNotif = new Notification({
                type : 'unfollow',
                owner : req.user._id,
                entity : idea._id,
                entityType : 'idea'
            });
            return myNotif.saveQ().then(function() {
                res.json(idea);
            });
        }).fail(function(err) {
            utils.sendError(res, 400, err);
        });
};

exports.like = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        if(idea.owner != req.user._id && idea.likerIds.indexOf(req.user._id) < 0) {
            return Idea.findOneAndUpdateQ({_id : req.params.id}, 
            {$addToSet : {likerIds : req.user._id}, 
            $pull : {dislikerIds : req.user._id}}).then(function(updated) {
                var myNotif = new Notification({
                    type : 'like',
                    owner : req.user._id,
                    entity : idea._id,
                    entityType : 'idea'
                });
                return myNotif.saveQ().then(function() {
                    res.json(updated);
                });
            }).fail(function(err) {
                utils.sendError(res, 400, err);
            });
        }
        else {
            res.json(idea);
        };
    });
};

exports.deleteLike = function(req, res) {
    Idea.findOneAndUpdateQ({_id : req.params.id}, 
        {$pull : {likerIds : req.user._id}}).then(function(updated) {
            res.json(updated);
        }).fail(function(err) {
            utils.sendError(res, 400, err);
        });
};

exports.getLikes = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        var count = '0';
        if(typeof idea.likerIds != 'undefined' && idea.likerIds.length > 0) {
            count = idea.likerIds.length.toString();
        };
        res.json(count);
    });
};

exports.dislike = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        if(idea.owner != req.user._id && idea.dislikerIds.indexOf(req.user._id) < 0) {
            return Idea.findOneAndUpdateQ({_id : req.params.id}, 
                {$addToSet : {dislikerIds : req.user._id}, 
                $pull : {likerIds : req.user._id}}).then(function(updated) {
                    var myNotif = new Notification({
                        type : 'dislike',
                        owner : req.user._id,
                        entity : idea._id,
                        entityType : 'idea'
                    });
                    return myNotif.saveQ().then(function() {
                        res.json(updated);
                    });
                }).fail(function(err) {
                    utils.sendError(res, 400, err);
                });
        }
        else {
            res.json(idea);
        };
    });
};

exports.getDislikes = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        var count = '0';
        if(typeof idea.dislikerIds != 'undefined' && idea.dislikerIds.length > 0) {
            count = idea.dislikerIds.length.toString();
        }
        res.json(count);
    });
};

exports.getRatings = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        var countLike = 0;
        var countDislike = 0;
        if(typeof idea.likerIds != 'undefined' && idea.likerIds.length > 0) {
            countLike = idea.likerIds.length.toString();
        };
        if(typeof idea.dislikerIds != 'undefined' && idea.dislikerIds.length > 0) {
            countDislike = idea.dislikerIds.length.toString();
        };
        res.json([countLike, countDislike]);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.createLink = function(req, res) {
    var ideaUpdateQuery, containerUpdateQuery;
    if(req.query.project){
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $addToSet : {projects: req.query.project }});
        containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.query.project},{$addToSet : {ideas: req.params.id}});
    } else if(req.query.challenge) {
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $addToSet : {challenges: req.query.challenge }});
        containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.query.challenge},{$addToSet : {ideas: req.params.id}});
    } else {
        return utils.sendErrorMessage(res, 403, "Please specify a project or challenge");
    }

    q.all([ideaUpdateQuery, containerUpdateQuery])
    .then(function() {
        return Idea.findOne({_id : req.params.id})
        .populate('tags')
        .populate('followers')
        .populate('owner')
        .execQ();
    }).then(function(idea) {
        res.json(idea);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};

exports.removeLink = function(req, res) {
    var ideaUpdateQuery, containerUpdateQuery;
    if(req.query.project){
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $pull : {projects: req.query.project }});
        containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.query.project},{$pull : {ideas: req.params.id}});
    } else if(req.query.challenge) {
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $pull : {challenges: req.query.challenge }});
        containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.query.challenge},{$pull : {ideas: req.params.id}});
    } else {
        return utils.sendErrorMessage(res, 403, "Please specify a project or challenge");
    }

    q.all([ideaUpdateQuery, containerUpdateQuery])
    .then(function() {
        return Idea.findOne({_id : req.params.id})
        .populate('tags')
        .populate('followers')
        .populate('owner')
        .execQ();
    }).then(function(idea) {
        res.json(idea);
    }).fail(function(err) {
        res.json(400, err);
    });
};

exports.popularIdeas = function(req, res) {
    // Get unrated ideas sorted by descending popularity (# likes)
    // TODO: maintain like count in DB in order to sort by it 

    // Get ideas that have not been liked or disliked by the user
    Idea.find({ $and: [ { likerIds: { $nin: [ req.user._id ] } }, { dislikerIds: { $nin: [ req.user._id ] } }, { owner: { $nin: [ req.user._id ] } } ] })
    .populate('owner')
    .execQ()
    .then(function(ideas) {
        // Sort ideas based on length of liker array
        var sortedIdeas =  _.sortBy(ideas, function(idea) { return -idea.likerIds.length; } );
        if(sortedIdeas.length > 0) {
            res.json(sortedIdeas[0]);
        }
        else {
            res.json(null);
        }
    })
    .fail(function(err) {
        utils.sendError(res, 500, err);
    });
};

exports.tagList = function(req, res) {
    Idea.findOne({_id : req.params.id})
    .populate('tags')
    .execQ()
    .then(function(idea) {
        var result = [];
        for (var i = 0; i < idea.tags.length; i++) {
            result[i] = idea.tags[i].title;
        }
        res.json(result);
    }).fail(function(err) {
        utils.sendError(res, 400, err);
    });
};
