var q = require('q'),
    mongoose = require('mongoose-q')(),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Notification = mongoose.model('Notification'),
    NoteLab = mongoose.model('NoteLab'),
    Files = mongoose.model('File'),
    Url = mongoose.model('Url'),
    Tags = mongoose.model('Tag'),
    Apply = mongoose.model('Apply'),
    Emailer = require('../services/mailer.service'),
    _ = require('lodash'),
    io = require('../../server').io;



exports.getPublications = function(req,res){
    NoteLab.findQ({ public : true, project  : req.params.id }).then(function(publications){
        res.json(publications);
    }).fail(function(err){
        res.json(400,err);
    })
}

exports.getByTag = function(req,res){
    if(req.params.tag == 'all'){
        Project.find().limit(req.query.limit).skip(req.query.skip).sort('-createDate').populate('tags').execQ().then(function(projects){

            res.json(projects);
        }).fail(function(err){
;
            res.json(400,err);
        })
    }else{
        Tags.findQ({ title : req.params.tag }).then(function(tag){
            Project.find({ tags : tag[0]._id }).limit(req.query.limit).skip(req.query.skip).populate('tags').sort('-createDate').execQ().then(function(projects){

                res.json(projects);
            }).fail(function(err){
;
                res.json(400,err);
            })
        }).fail(function(err){
            res.json(400,err);
        })
    }
};

exports.getUrls = function(req,res){
    Url.findQ({ project : req.params.id }).then(function(urls){
        res.json(urls)
    }).fail(function(err){
        res.json(400,err)
    })
};

exports.getFiles = function(req,res){
    Files.findQ({ project : req.params.id }).then(function(files){
        res.json(files);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.follow = function(req,res){

    Project.findOneAndUpdateQ({ _id : req.body.following },{$push : { followers : req.body.follower }}).then(function(project){
        var myNotif =  new Notification({
            type : 'followP',
            owner : project.owner,
            entity : project._id
        });
        myNotif.saveQ().then(function(){
            res.json(project)
        }).fail(function(err){

            res.json(400,err);
        });
    }).fail(function(err){

        res.json(400,err)
    })
};

exports.unfollow = function(req,res){
    Project.findOneAndUpdateQ({ _id : req.body.following },{$pull : { followers : req.body.follower }}).then(function(project){
        res.json(project)
    }).fail(function(err){
        res.json(500,err)
    })
};

exports.getByChallenge = function(req,res){
;
    Project.find({ container : req.params.challenge }).select('_id title poster tags').populate('tags').execQ().then(function(projects){
        res.json(projects);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.fetchOne = function(req,res){
    Project.findQ({ _id : req.params.id}).then(function(project){
        res.json(project[0]);
    }).fail(function(err){
        res.json(400,err)
    })
};

exports.fetch = function(req,res){
    if(req.query.accessUrl){
        Project
            .find({accessUrl : req.query.accessUrl})
            .populate('tags')
            .populate('followers')
            .populate('members')
            .populate('owner')
            .execQ()
            .then(function(project){
                res.json(project);
            }).catch(function(err){
                res.json(500,err);
            })
    }else if(req.query._id) {
        switch(req.query.type){
            case 'card':
                Project.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers members owner').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    res.json(400,err);
                });
                break;
            case 'info':
                Project.find({_id : req.query._id}).select('_id title accessUrl').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    res.json(400,err);
                });
                break;
            case 'block':
                Project.find({_id : req.query._id}).select('_id title accessUrl poster').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    res.json(400,err);
                });
                break;
            default :
                Project.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers members owner localisation home').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    res.json(400,err);
                });
                break;

        }
    }else{
        Project
            .find()
            .populate('tags')
            .select('_id title members')
            .execQ()
            .then(function(project){
                res.json(project);
            }).fail(function(err){
                res.json(500,err);
            })
    }
};

exports.create = function(req,res){

    if(req.body.tags){
        var tagsId = [];
        req.body.tags.forEach(function(tag,k){
            tagsId.push(tag._id)
        });

        req.body.tags = tagsId;
    }

    var project = new Project(req.body);
    project.saveQ().then(function(project){
        if(project.container){
            Challenge.findOneAndUpdateQ({_id : project.container},{ $push : { projects : project._id },$inc : { projectNumber : 1 }}).then(function(challenge){
                var myNotif =  new Notification({
                    type : 'project',
                    owner : project.owner,
                    entity : project,
                    container : project.container
                });
                myNotif.saveQ().then(function(notif){
                    io.sockets.in('challenge::'+project.container).emit('newProject',notif);
                    res.json(project)
                }).fail(function(err){
                    res.json(400,err);
                })
            }).fail(function(err){
                res.json(400,err)
            })
        }else{
            res.json(project)
        }
    }).fail(function(err){

        res.json(400,err)
    });
};

exports.update = function(req,res){
    // Get just the IDs of tags
    if(req.body.tags) {
        req.body.tags = _.pluck(req.body.tags, "_id");
    }

    Project.findOneAndUpdateQ({_id:req.params.id}, req.body, function(data) {
        res.json(data);
    }).fail(function(err){
        res.json(400,err)
    });
};

exports.remove = function(req,res){
    Project.removeQ({_id : req.query.id}).then(function(data){
        res.json(data);
    }).fail(function(err){
        res.json(400,err);
    })
};

exports.apply = function(req,res){

    var myApply = new Apply(req.body);
    myApply.saveQ().then(function(data){

        res.send(200);
    }).fail(function(err){

        res.json(err);
    });
//
//    var options = {
//        email: user.email,
//        pseudo: user.pseudo,
//        subject: "FDTD reset password",
//        template: "resetPassword"
//    };
//
//
//    var data = {
//        pseudo: user.pseudo,
//        email: user.email,
//        token: user.reset_password_token,
//        domain: Config.public_url
//
//    };
//
//    var emailer = new Emailer(options, data);
//    emailer.send(function (err, result) {
//        console.log(result)
//        if (err) {
//            error.emit('mail',new Error('unknow email'));
//        }
//    });
};

exports.fetchApply = function(req,res){

    Apply.findQ({ container : req.query.container }).then(function(applies){
        res.json(applies);
    }).fail(function(err){
        res.json(500,err)
    })
};

exports.finishApply = function(req,res){
    Apply.findOneAndUpdateQ({ _id : req.params.id },{ status : true,accepted : req.body.accepted }).then(function(){
        res.send(200);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.addToTeam = function(req,res){

    var myNotif = new Notification({
        entity : req.params.projectId,
        owner : req.body.userId,
        type : 'join'
    });
    q.all([
        Project.findOneAndUpdateQ({ _id : req.params.projectId },{$push : { members : req.body.userId }}),
        myNotif.saveQ()
    ]).then(function(data){
        io.sockets.in('project::'+req.params.projectId).emit('newMember',data[1]);
        res.send(200);
    }).fail(function(err){

        res.json(400,err);

    });
};

exports.banFromTeam = function(req,res) {
    var myNotif = new Notification({
        entity : req.params.id,
        owner : req.body.member,
        type : 'join'
    });
    q.all([
        Project.findOneAndUpdateQ({ _id: req.params.id }, {$pull: { members: req.body.member }}),
        myNotif.saveQ()
    ]).then(function(data){
        io.sockets.in('project::'+req.params.id).emit('banMember',data[1]);
        res.send(200);
    }).fail(function(err){

        res.json(400,err);
    });

};