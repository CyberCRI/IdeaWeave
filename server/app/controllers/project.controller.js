var fs = require('fs'),
    q = require('q'),
    mongoose = require('mongoose-q')(),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Notification = mongoose.model('Notification'),
    NoteLab = mongoose.model('NoteLab'),
    File = mongoose.model('File'),
    Url = mongoose.model('Url'),
    Tags = mongoose.model('Tag'),
    Apply = mongoose.model('Apply'),
    Emailer = require('../services/mailer.service'),
    _ = require('lodash');



exports.getPublications = function(req,res){
    NoteLab.findQ({ public : true, project  : req.params.id }).then(function(publications){
        res.json(publications);
    }).fail(function(err){
        res.json(400,err);
    })
}

exports.getByTag = function(req,res){
    function completeQuery(query) {
        query.limit(req.query.limit)
            .skip(req.query.skip)
            .select('_id createDate accessUrl title brief owner tags followers members poster')
            .sort('-createDate')
            .populate('tags')
            .execQ().then(function(projects){
            res.json(projects);
        }).fail(function (err){
            res.json(400,err);
        });
    }

    if(req.params.tag == 'all'){
        completeQuery(Project.find());
    } else {
        Tags.findQ({ title : req.params.tag }).then(function (tag) {
            completeQuery(Project.find({ tags : tag[0]._id }));
        });
    }
};


// URLS

exports.listUrls = function(req,res){
    Url.find({ project : req.params.projectId }).populate("owner").execQ().then(function(urls){
        res.json(urls)
    }).fail(function(err){
        res.json(400,err)
    })
};

exports.createUrl = function(req,res){
    // TODO: Check that the current user can write URLs in this project or challenge (is owner or contributor)

    // Note will be owned by the current user
    req.body.owner = req.user._id; 
    req.body.project = req.params.projectId; 

    var myUrl = new Url(req.body);

    myUrl.saveQ().then(function(data){
        var myNotif =  new Notification({
            type : 'createUrl',
            owner : req.user._id,
            entity : req.params.projectId,
            entityType : 'project'
        });

        return myNotif.saveQ().then(function(notif){
            res.json(data);
        }).catch(function(err){
            res.json(500,err);
        });
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.fetchUrl = function(req,res){
    Url.findOneQ({ _id : req.params.urlId }).populate("owner").then(function(note){
        if(!note) return res.send(400);
        res.json(note);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.removeUrl = function(req,res){
    Url.findOneQ({ _id : req.params.urlId }).then(function(url){
        if(!url) return res.send(400);
        // TODO: check if you are allowed to remove the URL

        url.removeQ().then(function() {
            var myNotif =  new Notification({
                type : 'removeUrl',
                owner : req.user._id,
                entity : req.params.projectId,
                entityType : 'project'
            });
            return myNotif.saveQ().then(function(){
                res.send(200);
            });
        }).fail(function(err){
            res.json(500,err);
        });
    }).fail(function(err){
        res.json(500,err);
    });
};


// FILES

exports.listFiles = function(req,res){
    File.find({ project : req.params.projectId }).populate("owner").execQ().then(function(files){
        res.json(files);
    }).fail(function(err){
        res.json(400, err);
    });
};

exports.uploadFile = function(req,res) {
    console.log("Files: ", req.files);
    if (!req.files) return req.json(300, "No message recieved");

    var myFile = new File(req.files.file);
    myFile.name = req.files.file.name;
    myFile.type = req.files.file.mimetype;
    myFile.originalName = req.files.file.originalname;
    myFile.description = req.body.description;
    myFile.owner = req.user._id; 
    myFile.project = req.params.projectId; 

    console.log("File ready to save", myFile);

    myFile.saveQ().then(function(data){
        var myNotif =  new Notification({
            type : 'uploadFile',
            owner : req.user._id,
            entity : req.params.projectId,
            entityType : 'project'
        });
        return myNotif.saveQ().then(function(notif){
            res.json(data);
        }).catch(function(err){
            res.json(400,err)
        })
    }).fail(function(err){
        res.json(500,err);
    });
};

exports.fetchFile = function(req,res){
    File.findOneQ({ _id : req.params.fileId }).populate("owner").then(function(note){
        if(!note) return res.send(400);
        res.json(note);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.removeFile = function(req,res){
    console.log("Removing file", req.params.fileId);
    File.findOneQ({ _id : req.params.fileId }).then(function(file){
        if(!file) return res.send(400);
        // TODO: check if you are allowed to remove the file

        var unlink = q.denodeify(fs.unlink);

        return q.all([unlink(file.path), file.removeQ()]).then(function() {
            var myNotif =  new Notification({
                type : 'removeFile',
                owner : req.user._id,
                entity : req.params.projectId   ,
                entityType : 'project'
            });
            return myNotif.saveQ().then(function(notif){
                res.send(200);
            });
        });
    }).fail(function(err){
        res.json(500,err);
    });
};


exports.follow = function(req,res){
    req.body.follower = req.user._id;

    Project.findOneAndUpdateQ({ _id : req.body.following },{$push : { followers : req.body.follower }}).then(function(project){
        var myNotif =  new Notification({
            type : 'follow',
            owner : req.body.follower,
            entity : project._id,
            entityType : 'project'
        });
        return myNotif.saveQ().then(function(){
            res.json(project)
        });
    }).fail(function(err){
        res.json(400,err)
    })
};

exports.unfollow = function(req,res){
    req.body.follower = req.user._id;

    Project.findOneAndUpdateQ({ _id : req.body.following },{$pull : { followers : req.body.follower }}).then(function(project){
        var myNotif = new Notification({
            type : 'unfollow',
            owner : req.body.follower,
            entity : project._id,
            entityType : 'project'
        });
        return myNotif.saveQ().then(function() {
            res.json(project);
        });
    }).fail(function(err){
        res.json(500,err)
    })
};

exports.getByChallenge = function(req,res){
    Project.find({ container : req.params.challenge }).select('_id title poster tags accessUrl brief').populate('tags').execQ().then(function(projects){
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
                Project.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers members owner localisation home trello showProgress progress').populate('tags').execQ().then(function(data){
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
            .select('_id title members poster')
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

    req.body.owner = req.user._id;
    var project = new Project(req.body);

    project.saveQ().then(function(project){
        if(project.container){
            Challenge.findOneAndUpdateQ({_id : project.container},{ $push : { projects : project._id },$inc : { projectNumber : 1 }}).then(function(challenge){
                var myNotif =  new Notification({
                    type : 'create',
                    owner : project.owner,
                    entity :  project._id,
                    entityType : 'project'
                });
                myNotif.saveQ().then(function(notif){
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
    // Remove properties that can't be updated this way
    req.body = _.omit(req.body, "_id", "_v", "members", "followers");

    // Get just the IDs of tags
    if(req.body.tags) {
        req.body.tags = _.pluck(req.body.tags, "_id");
    }

    // Get just the ID of the owner
    if(req.body.owner) {
        req.body.owner = req.body.owner._id;
    }

    Project.findOneAndUpdateQ({_id:req.params.id}, req.body).then(function(data) {
        var myNotif = new Notification({
            type : 'update',
            owner : req.user._id,
            entity :  data._id,
            entityType : 'project'
        });
        return myNotif.saveQ().then(function(notif){
            res.json(data);
        });
    }).fail(function(err){
        res.json(400,err)
    });
};

exports.remove = function(req,res){
    Project.findOneAndRemoveQ({_id : req.params.id}).then(function(data){
        var myNotif = new Notification({
            type : 'remove',
            owner : req.user._id,
            entity : data._id,
            entityType : 'project'
        });
        return myNotif.saveQ().then(function() {
            res.json(data);
        });
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
    var projectId = req.params.id;
    var ownerId = req.user._id;
    var applierId = req.body.userId;

    var myNotif = new Notification({
        entity : projectId,
        owner : ownerId,
        type : 'join',
        entityType : 'project'
    });

    q.all([
        Project.findOneAndUpdateQ({ _id : projectId },{ $push : { members : applierId }}),
        myNotif.saveQ()
    ]).then(function(data){
        res.send(200);
    }).fail(function(err){
        res.json(400,err);
    });
};

exports.banFromTeam = function(req,res) {
    var myNotif = new Notification({
        entity : req.params.id,
        owner : req.body.member,
        type : 'ban',
        entityType : 'project'
    });
    q.all([
        Project.findOneAndUpdateQ({ _id: req.params.id }, {$pull: { members: req.body.member }}),
        myNotif.saveQ()
    ]).then(function(data){
        res.send(200);
    }).fail(function(err){

        res.json(400,err);
    });

};