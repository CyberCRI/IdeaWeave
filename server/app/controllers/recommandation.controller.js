'use strict';

var q = require('q'),
    mongoose = require('mongoose-q')(),
    Challenge = mongoose.model('Challenge'),
    Project = mongoose.model('Project'),
    NoteLab = mongoose.model('NoteLab'),
    Url = mongoose.model('Url'),
    User = mongoose.model('User'),
    _ = require('lodash');




exports.fetchUsers = function(req,res){
    q.all([
        User.find({tags : {$in : req.user.tags}}).populate('_id').execQ(),
        User.find({ _id : req.user._id}).populate('followings').execQ()
    ]).then(function(data){
        var followings = data[1],
            users = data[0];
        followings.forEach(function(following,k){
            users.filter(function(user){
                return user._id == following;
            })
        });
        res.json(users);
    }).fail(function(err){
        res.json(400,err);
    });
};

exports.fetchProjects = function(req,res){
    q.all([
        Project.find({tags : {$in : req.user.tags}}).populate('_id').execQ(),
        Project.find({owner : req.user._id}).populate('_id').execQ(),
        User.find({_id : req.user._id}).populate('followings').execQ()
    ]).then(function(data){
        var projects = data[0],
            myProjects = data[1],
            followings = data[2];
        followings.forEach(function(following){
            projects.filter(function(project){
                return project._d == following;
            })
        });
        myProjects.forEach(function(mProject){
            projects.filter(function(project){
                return project._id == mProject._id
            })
        });
        res.json(projects)
    }).fail(function(err){
        res.json(400,err);
    });
};

exports.fetchChallenges = function(req,res){
    q.all([
        Challenge.find({tags : {$in : req.user.tags}}).populate('_id').execQ(),
        Challenge.find({owner : req.user._id}).populate('_id').execQ(),
        User.find({_id : req.user._id}).populate('followings').execQ()
    ]).then(function(data){
        var challenges = data[0],
            myChallenges = data[1],
            followings = data[2];
        followings.forEach(function(following){
            challenges.filter(function(challenge){
                return challenge._d == following;
            })
        });
        myChallenges.forEach(function(mChallenge){
            challenges.filter(function(challenge){
                return challenge._id == mChallenge._id
            })
        });
        res.json(challenges)
    }).fail(function(err){
        res.json(400,err);
    });
};


exports.popular = function(req,res){
    q.all([
        Challenge.find().sort('-projectNumber').limit(3).execQ(),
        Project.find().sort('-projectNumber').limit(10).execQ()
    ]).then(function(data){
        var response = {
            challenges : data[0],
            projects : data[1]
        };
        res.json(response);
    }).catch(function(err){

        res.json(400,err);
    })

};


