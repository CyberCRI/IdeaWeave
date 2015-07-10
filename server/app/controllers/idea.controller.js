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
            res.json(400, err);
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
            res.json(500, err);
        });
};

exports.getByTag = function(req,res){
    if(req.params.tag == 'all'){
        Idea.find().limit(req.query.limit).skip(req.query.skip).sort('-createDate').populate('tags').sort('-createDate').execQ().then(function(ideas){
            res.json(ideas);
        }).fail(function(err){
            res.json(400,err);
        })
    }else{
        Tags.findQ({ title : req.params.tag }).then(function(tag){
            Idea.find({ tags : tag[0]._id }).limit(req.query.limit).skip(req.query.skip).populate('tags').sort('-createDate').execQ().then(function(ideas){
                res.json(ideas);
            }).fail(function(err){
                res.json(400,err);
            })
        }).fail(function(err){
            res.json(400,err);
        })
    }
};

exports.create = function(req, res) {
    if(req.body.tags) {
        var tagsId = [];
        req.body.tags.forEach(function(tag, k) {
            tagsId.push(tag._id);
        });
        req.body.tags = tagsId;
    };

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
        console.log("Saving notification...");
        return myNotif.saveQ().then(function(notif) {
            res.json(idea);
        }).then(function() {
            // Create 1st discussion
            var newNote = new NoteLab({
                owner: req.user._id,
                idea: idea._id,
                text: idea.title
            });
            return newNote.saveQ();;
        });
    }).fail(function(err) {
        res.json(400, err);
    });
};

exports.update = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        if(!canModifyIdea(req.user, idea)) {
            return res.json(403, "You are not allowed to modify this idea");
        };
        idea.brief = req.body.brief;
        idea.language = req.body.language;
        idea.tags = req.body.tags;
        idea.modifiedDate = new Date();
        idea.saveQ().then(function(modifiedIdea) {
            var myNotif = new Notification({
                type : 'update',
                owner : req.user._id,
                entity : modifiedIdea._id,
                entityType : 'idea'
            });
            myNotif.saveQ().then(function() {
                res.json(200, modifiedIdea);
            });
        }).fail(function(err) {
            res.json(400, err);
        });
    });
};

exports.remove = function(req, res) {
    Idea.findOneAndRemoveQ({_id : req.params.id}).then(function(idea) {
        var myNotif = new Notification({
            type : 'remove',
            owner : req.user._id,
            entity : idea._id,
            entityType : 'idea'
        });
        myNotif.saveQ().then(function() {
            res.json(idea);
        });
    }).fail(function(err) {
        res.json(400, err);
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
            myNotif.saveQ().then(function() {
                res.json(idea);
            }).fail(function(err) {
                res.json(400, err);
            });
        }).fail(function(err) {
            res.json(400, err);
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
            myNotif.saveQ().then(function() {
                res.json(idea);
            });
        }).fail(function(err) {
            res.json(400, err);
        });
};

exports.like = function(req, res) {
    Idea.findOneQ({_id : req.params.id}).then(function(idea) {
        if(idea.owner != req.body.liker && idea.likerIds.indexOf(req.body.liker) < 0) {
            Idea.findOneAndUpdateQ({_id : req.params.id}, 
                {$push : {likerIds : req.body.liker}, 
                $pull : {dislikerIds : req.body.liker}}).then(function(updated) {
                    var myNotif = new Notification({
                        type : 'like',
                        owner : req.user._id,
                        entity : idea._id,
                        entityType : 'idea'
                    });
                    myNotif.saveQ().then(function() {
                        res.json(updated);
                    });
                }).fail(function(err) {
                    res.json(400, err);
                });
        }
        else {
            res.json("already liked");
        };
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
        if(idea.owner != req.body.disliker && idea.dislikerIds.indexOf(req.body.disliker) < 0) {
            Idea.findOneAndUpdateQ({_id : req.params.id}, 
                {$push : {dislikerIds : req.body.disliker}, 
                $pull : {likerIds : req.body.disliker}}).then(function(updated) {
                    var myNotif = new Notification({
                        type : 'dislike',
                        owner : req.user._id,
                        entity : idea._id,
                        entityType : 'idea'
                    });
                    myNotif.saveQ().then(function() {
                        res.json(updated);
                    });
                }).fail(function(err) {
                    res.json(400, err);
                });
        }
        else {
            res.json("already disliked");
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

exports.createLink = function(req, res) {
    var ideaUpdateQuery, containerUpdateQuery;
    if(req.query.project){
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $addToSet : {projects: req.query.project }});
        containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.query.project},{$addToSet : {ideas: req.params.id}});
    } else if(req.query.challenge) {
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $addToSet : {challenges: req.query.challenge }});
        containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.query.challenge},{$addToSet : {ideas: req.params.id}});
    } else {
        return res.json(403, "Please specify a project or challenge");
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

exports.removeLink = function(req, res) {
    var ideaUpdateQuery, containerUpdateQuery;
    if(req.query.project){
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $pull : {projects: req.query.project }});
        containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.query.project},{$pull : {ideas: req.params.id}});
    } else if(req.query.challenge) {
        ideaUpdateQuery = Idea.findOneAndUpdateQ({_id : req.params.id}, { $pull : {challenges: req.query.challenge }});
        containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.query.challenge},{$pull : {ideas: req.params.id}});
    } else {
        return res.json(403, "Please specify a project or challenge");
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
