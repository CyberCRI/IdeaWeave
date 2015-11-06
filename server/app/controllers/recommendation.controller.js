'use strict';

var q = require('q'),
    mongoose = require('mongoose-q')(),
    Challenge = mongoose.model('Challenge'),
    Project = mongoose.model('Project'),
    NoteLab = mongoose.model('NoteLab'),
    Url = mongoose.model('Url'),
    User = mongoose.model('User'),
    utils = require('../services/utils.service'),
    _ = require('lodash');


function reduceTags(tags){
    if(!tags){
        tags = [];
    }else if(typeof tags  == 'string') {
        var temp = [];
        temp.push(tags);
        tags = temp;
    }
    return tags;
}


exports.fetchUsers = function(req,res){
    var tags = reduceTags(req.query.tags);
    q.all([
        User.random({tags : {$in : tags}}),
        User.find({ _id : req.user._id}).populate('followings').execQ()
    ]).then(function(data){
        var followings = data[1],
            users = data[0];
        followings.forEach(function(following,k){
            users.forEach(function(user,k){
                if(user._id == following){
                    users.splice(k,1);
                }
            })
        });
        users.forEach(function(user,k){
            if(user._id == req.user._id){
                users.splice(k,1);
            }
        });
        res.json(users);
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.fetchProjects = function(req,res){
    var tags = reduceTags(req.query.tags)
    q.all([
        Project.random({tags : {$in : tags}}),
        User.find({_id : req.user._id}).populate('followings').execQ()
    ]).then(function(data){
        var projects = data[0],
            followings = data[1];
        followings.forEach(function(following){
            projects.forEach(function(project,k){
                if(project._id == following){
                    projects.splice(k,1);
                }
            })
        });
        projects.forEach(function(project,k){
            if(project.owner == req.user._id){
                projects.splice(k,1);
            }
        });
        res.json(projects)
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.fetchChallenges = function(req,res){
    var tags = reduceTags(req.query.tags)
    q.all([
        Challenge.random({tags : {$in : tags}}),
        User.find({_id : req.user._id}).populate('followings').execQ()
    ]).then(function(data){
        var challenges = data[0],
            followings = data[1];
        followings.forEach(function(following){
            challenges.forEach(function(challenge,k){
                 if(challenge._d == following){
                     challenges.splice(k,1)
                 }
            })
        });
        challenges.forEach(function(challenge,k){
            if(challenge.owner == req.user._id){
                challenges.splice(k,1)
            }
        });
        res.json(challenges)
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};


exports.popular = function(req,res){
    q.all([
        Challenge.find().sort('-createDate').limit(3).populate("tags").execQ(),
        Project.find().sort('-createDate').limit(9).populate("tags").execQ()
    ]).then(function(data){
        var response = {
            challenges : data[0],
            projects : data[1]
        };
        res.json(response);
    }).catch(function(err){
        utils.sendError(res, 400, err);
    })

};


