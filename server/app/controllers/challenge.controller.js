var mongoose = require('mongoose-q')(),
    Challenge = mongoose.model('Challenge'),
    Tags = mongoose.model('Tag'),
    Notification = mongoose.model('Notification'),
    Template = mongoose.model('Template'),
    io = require('../../server').io,
    _ = require('lodash'),
    q = require('q');


exports.createTemplate = function(req,res){
    var myTemplate = req.body;
    new Template(myTemplate).saveQ().then(function(template){
        res.json(template);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.getTemplates = function(req,res){
    Template.findQ({challenge : req.params.id}).then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.getByTag = function(req,res){
    if(req.params.tag == 'all'){
        Challenge.find().limit(req.query.limit).skip(req.query.skip).sort('-createDate').populate('tags').sort('-createDate').execQ().then(function(challenges){
            res.json(challenges);
        }).fail(function(err){
            res.json(400,err);
        })
    }else{
        Tags.findQ({ title : req.params.tag }).then(function(tag){
            Challenge.find({ tags : tag[0]._id }).limit(req.query.limit).skip(req.query.skip).populate('tags').sort('-createDate').execQ().then(function(challenges){

                res.json(challenges);
            }).fail(function(err){
                res.json(400,err);
            })
        }).fail(function(err){
            res.json(400,err);
        })
    }
};

exports.follow = function(req,res){
    Challenge.findOneAndUpdateQ({ _id : req.body.following },{$push : { followers : req.body.follower }}).then(function(challenge){
        var myNotif =  new Notification({
            type : 'followC',
            owner : challenge.owner,
            entity : challenge._id
        });
        myNotif.saveQ().then(function(){
            res.json(challenge);
        });
    }).fail(function(err){
        res.json(400,err)
    })

};

exports.unfollow = function(req,res){

    Challenge.findOneAndUpdateQ({ _id : req.body.following },{$pull : { followers : req.body.follower }}).then(function(challenge){
        res.json(challenge)
    }).fail(function(err){
        res.json(400,err)
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
                        res.json(400,err);
                    }
                    res.json(challenge);
                });
        }
    }else if(req.query._id) {
            switch(req.query.type){
                case 'card':
                    Challenge.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers startDate endDate projects owner').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        res.json(400,err);
                    })
                    break;
                case 'info':
                    Challenge.find({_id : req.query._id}).select('_id title accessUrl').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        res.json(400,err);
                    });
                    break;
                case 'block':
                    Challenge.find({_id : req.query._id}).select('_id title accessUrl poster').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        res.json(400,err);
                    });
                    break;
                default:
                    Challenge.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers owner home').populate('tags').execQ().then(function(data){

                        res.json(data);
                    }).catch(function(err){
                        res.json(400,err);
                    });
                    break;
            }

    }else{
        Challenge.find().populate('tags').select('-banner').execQ().then(function (challenges) {
            res.json(challenges);
        }).fail(function (err) {
            res.json(400, err);
        })
    }
};

exports.create = function(req,res){
    var tagsId = [];
    if(req.body.tags) {
        req.body.tags.forEach(function(tag,k){
            tagsId.push(tag._id)
        });
        req.body.tags = tagsId;
    }
    var challenge = new Challenge(req.body);
    challenge.saveQ().then(function(data){
        var myNotif =  new Notification({
            type : 'challenge',
            owner : data.owner,
            entity : data._id
        });
        console.log("Saving notification...");
        myNotif.saveQ().then(function(notif){
            console.log("Saving notification.");
            io.sockets.emit('newChallenge',notif);
            console.log("Sent notification.");
            res.json(data);
        }).fail(function(err) {
            res.json(500, err);
        });
    }).fail(function(err){
        res.json(400,err);
    });
};

exports.update = function(req,res){
    Challenge.findOneAndUpdateQ({ _id : req.params.id },req.body).then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.remove = function(req,res){
    Challenge.findOneAndRemoveQ({_id : req.params.id}).then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(400,err);
    })
};