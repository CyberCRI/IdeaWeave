'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    Challenge= mongoose.model('Challenge'),
    Idea = mongoose.model('Idea'),
    Notification = mongoose.model('Notification'),
    Tags = mongoose.model('Tag'),
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
            type : 'follow',
            owner : req.body.follower,
            entity : req.body.following,
            entityType : 'profile'
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
        var myNotif = new Notification({
            type : 'unfollow',
            owner : req.body.follower,
            entity : user._id,
            entityType : 'profile'
        });
        myNotif.saveQ().then(function() {
            res.json(user);
        });
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
        var myNotif = new Notification({
            type : 'update',
            owner : user._id,
            entity : user._id,
            entityType : 'profile'
        });
        myNotif.saveQ().then(function() {
            res.json(user);
        });
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

    req.user.comparePassword(passwordDetails.currentPassword, function(err, isMatch) {
        if (err || !isMatch) {
            return res.status(400).send({ message: 'Current password is incorrect' });
        }

        // The password will be hashed automatically
        req.user.password = passwordDetails.newPassword;

        req.user.saveQ().then(function() { 
            res.send({
                message: 'Password changed successfully'
            });
        }).fail(function(err){
            return res.send(400, {
                message: getErrorMessage(err)
            });
        });
    });
};


/**
 * Send User
 */
exports.me = function(req, res) {
    User.findOne({ _id : req.user._id })
    .populate('followers')
    .populate('tags')
    .execQ()
    .then(function(data){
        res.json(data);
    }).catch(function(err){
        res.json(500, err);
    });
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
                Challenge.findQ({owner : myProfile._id},'_id'),
                Idea.findQ({owner: myProfile._id},'_id'),
                Idea.findQ({followers: myProfile._id},'_id')
            ]).then(function(data){
                var moreData = {};
                moreData.followedUsers = data[0];
                moreData.followedChallenges = data[1];
                moreData.followedProjects = data[2];
                moreData.memberProjects = data[3];
                moreData.projects = data[4];
                moreData.challenges = data[5];
                moreData.ideas = data[6];
                moreData.followedIdeas = data[7];
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

exports.getByTag = function(req,res){
    if(req.params.tag == 'all'){
        User.find().limit(req.query.limit).skip(req.query.skip).sort('-createDate').populate('tags').sort('-createDate').execQ().then(function(profiles){
            res.json(profiles);
        }).fail(function(err){
            res.json(400,err);
        })
    }else{
        Tags.findQ({ title : req.params.tag }).then(function(tag){
            User.find({ tags : tag[0]._id }).limit(req.query.limit).skip(req.query.skip).populate('tags').sort('-createDate').execQ().then(function(profiles){

                res.json(profiles);
            }).fail(function(err){
                res.json(400,err);
            })
        }).fail(function(err){
            res.json(400,err);
        })
    }
};

exports.getIdeas = function(req, res) {
    Idea.findQ({owner : req.params.id}).then(function(ideas) {
        res.json(ideas);
    }).fail(function(err) {
        res.json(400, err);
    });
};

exports.getLikes = function(req, res) {
    var likes = [];
    Idea.findQ().then(function(ideas) {
        for(var i = 0; i < ideas.length; i++) {
            var ids = ideas[i].likerIds;
            for(var j = 0; j < ids.length; j++) {
                if(ids[j] == req.params.id) {
                    likes.push(ideas[i].id);
                    break;
                };
            };
        };
    }).then(function() {
            res.json(likes);
    }).fail(function(err) {
        res.json(400, err);
    });
};