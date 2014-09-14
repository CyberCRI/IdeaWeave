'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    Challenge= mongoose.model('Challenge'),
    Notification = mongoose.model('Notification'),
    q = require('q');


exports.getActivity = function(req,res){
    Notification.find({ owner : req.params.id }).limit(req.query.limit).sort({createDate : -1}).execQ().then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json(400,err);
    })
};

exports.getPoster = function(req,res){
    User.findOne({ _id  : req.params.id}).select('poster').execQ().then(function(data){
        res.json(data)
    }).fail(function(err){
        res.json(400,err);
    })
};


exports.follow = function(req,res){
    q.all([
        User.findOneAndUpdateQ({ _id : req.body.following },{$push : { followers : req.body.follower }}),
        User.findOneAndUpdateQ({ _id : req.body.follower },{$push : { followings : req.body.following }})
    ]).then(function(data){
        var myNotif =  new Notification({
            type : 'followU',
            owner : req.body.follower,
            entity : req.body.following
        });
        myNotif.saveQ().then(function(){
            res.send(200);
        });
    }).catch(function(err){
        res.json(400,err)
    })
};

exports.unfollow = function(req,res){
    q.all([
        User.findOneAndUpdateQ({ _id : req.body.following },{$pull : { followers : req.body.follower }}),
        User.findOneAndUpdateQ({ _id : req.body.follower },{$pull : { followings : req.body.following }})
    ]).then(function(user){
        res.json(user)
    }).catch(function(err){
        res.json(500,err)
    })
};


/**
 * Update user details
 */
exports.update = function(req, res) {
    if(req.body.tags){
        req.body.tags.forEach(function(tag,k){
            req.body.tags[k] = tag._id
        });
    }
    User.findOneAndUpdateQ({ _id : req.params.id },req.body).then(function(user){
        res.json(user);
    }).catch(function(err){
        res.json(400,err);
    })
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
    // Init Variables
    var passwordDetails = req.body;
    var message = null;

    if (req.user) {
        User.findOneQ({_id : req.user.id}).then(function(user) {
            if (user) {
                if (user.authenticate(passwordDetails.currentPassword)) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;

                        user.saveQ().then(function(err) {
                            req.login(user, function(err) {
                                if (err) {
                                    res.send(400, err);
                                } else {
                                    res.send({
                                        message: 'Password changed successfully'
                                    });
                                }
                            });
                        }).fail(function(err){
                            return res.send(400, {
                                message: getErrorMessage(err)
                            });
                        });
                    } else {
                        res.send(400, {
                            message: 'Passwords do not match'
                        });
                    }
                } else {
                    res.send(400, {
                        message: 'Current password is incorrect'
                    });
                }
            } else {
                res.send(400, {
                    message: 'User is not found'
                });
            }
        }).fail(function(err){
            res.send(400,'DataBase error')
        });
    } else {
        res.send(400, {
            message: 'User is not signed in'
        });
    }
};


/**
 * Send User
 */
exports.me = function(req, res) {

    q.all([
        Challenge.find({ owner : req.user._id }).select('_id').execQ(),
        Project.find({ owner : req.user._id }).select('_id').execQ(),
        Project.find({ members : req.user._id }).select('members').execQ()
    ]).then(function(data){
        var response = req.user;
        response.projects = data[1].concat(data[2]);
        response.challenges = data[0];
        res.json(req.user);
    }).catch(function(err){
        res.json(400,err);
    });
};


exports.fetchAll = function(req,res){
    User.findQ().then(function(users){
        res.json(users);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.fetch = function(req,res){
    if(req.query._id){
        if(req.query.type){
            var query;
            switch(req.query.type){
                case 'card':
                    query = User.find({_id : req.query._id}).select('_id username realname brief tags poster followers followings projects').populate('tags');
                    break;
                case 'info':
                    query = User.find({_id : req.query._id}).select('_id username realname');
                    break;
                case 'block':
                    query = User.find({_id : req.query._id}).select('_id username realname poster').populate('tags');
                    break;
            }
            query.execQ().then(function(data){
                res.json(data);
            }).catch(function(err){
                res.json(400,err);
            })
        }
    }else {
        User.find({ _id : req.query.id })
            .populate('tags')
            .execQ()
            .then(function(user){
                res.json(user);
            }).catch(function(err){
                res.json(500,err);
            });
    }
};
exports.profile = function(req,res){
    User.find({ _id : req.params.id })
        .populate('followers')
        .populate('tags')
        .execQ()
        .then(function(profile){
            console.log(profile)
            var myProfile = profile[0];
            q.all([
                User.findQ({'followers':  myProfile._id },'_id'),
                Challenge.findQ({'followers': myProfile._id },'_id'),
                Project.findQ({'followers':  myProfile._id },'_id'),
                Project.findQ({'members':  myProfile._id },'_id'),
                Project.findQ({owner : myProfile._id},'_id'),
                Challenge.findQ({owner : myProfile._id},'_id')
            ]).then(function(data){
                var moreData = {};
                moreData.followedUsers = data[0];
                moreData.followedChallenges = data[1];
                moreData.followedProjects = data[2];
                moreData.memberProjects = data[3];
                moreData.projects = data[4];
                moreData.challenges = data[5];
                var response = {
                    data : myProfile,
                    moreData : moreData
                };
                res.json(response);
            }).fail(function(err){
                console.log(err);
                res.json(500,err);
            });
        }).fail(function(err){
            console.log(err);
            res.json(500,err);
        });
//    {brief:{$regex:tag+".*"
};