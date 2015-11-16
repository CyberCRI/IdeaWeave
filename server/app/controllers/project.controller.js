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
    tagController = require('./tag.controller'),
    utils = require('../services/utils.service'),
    _ = require('lodash');


function canModifyProject(user, project) {
    var projectMemberIds = _.map(project.members, function(member) { return member.toString(); });
    return user._id.toString() == project.owner.toString() || _.contains(projectMemberIds, user._id.toString());
};

function canRemoveProject(user, project) {
    return user._id.toString() == project.owner.toString();
};


exports.getPublications = function(req,res){
    NoteLab.findQ({ public : true, project  : req.params.id }).then(function(publications){
        res.json(publications);
    }).fail(function(err){
        utils.sendError(res, 400, err);
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
            utils.sendError(res, 400, err);
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
        utils.sendError(res, 400, err);
    })
};

exports.createUrl = function(req,res) {
    Project.findOneQ({ _id: req.params.projectId }).then(function(project) {
        if(!canModifyProject(req.user, project)) return res.json(403, { message: "You are not allowed to modify this project" });

        // Note will be owned by the current user
        req.body.owner = req.user._id; 
        req.body.project = req.params.projectId; 

        var myUrl = new Url(req.body);

        return myUrl.saveQ().then(function(data){
            var myNotif =  new Notification({
                type : 'createUrl',
                owner : req.user._id,
                entity : req.params.projectId,
                entityType : 'project'
            });

            return myNotif.saveQ().then(function(notif){
                res.json(data);
            });
        }).fail(function(err){
            utils.sendError(res, 500, err);
        });
    }).fail(function(err) {
        res.status(400).end();
    });
};

exports.fetchUrl = function(req,res){
    Url.findOneQ({ _id : req.params.urlId }).populate("owner").then(function(note){
        if(!note) return res.status(400).send();
        res.json(note);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    })
};

exports.removeUrl = function(req,res){
    Project.findOneQ({ _id: req.params.projectId }).then(function(project) {
        if(!canModifyProject(req.user, project)) return res.json(403, { message: "You are not allowed to modify this project" });

        return Url.findOneQ({ _id : req.params.urlId }).then(function(url){
            if(!url) return res.status(400).send();

            return url.removeQ().then(function() {
                var myNotif =  new Notification({
                    type : 'removeUrl',
                    owner : req.user._id,
                    entity : req.params.projectId,
                    entityType : 'project'
                });
                return myNotif.saveQ().then(function(){
                    res.status(200).send();
                });
            });
        }).fail(function(err){
            utils.sendError(res, 500, err);
        });
    }).fail(function(err) {
        res.status(400).send();
    });
};


// FILES

exports.listFiles = function(req,res){
    File.find({ project : req.params.projectId }).populate("owner").execQ().then(function(files){
        res.json(files);
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.uploadFile = function(req,res) {
    Project.findOneQ({ _id: req.params.projectId }).then(function(project) {
        if(!canModifyProject(req.user, project)) return res.json(403, "You are not allowed to modify this project");

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

        return myFile.saveQ().then(function(data){
            var myNotif =  new Notification({
                type : 'uploadFile',
                owner : req.user._id,
                entity : req.params.projectId,
                entityType : 'project'
            });
            return myNotif.saveQ().then(function(notif){
                res.json(data);
            });
        }).fail(function(err){
            utils.sendError(res, 500, err);
        });
    }).fail(function(err) {
        res.send(400);
    });
};

exports.fetchFile = function(req,res){
    File.findOneQ({ _id : req.params.fileId }).populate("owner").then(function(note){
        if(!note) return res.send(400);
        res.json(note);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    })
};

exports.removeFile = function(req,res){
    Project.findOneQ({ _id: req.params.projectId }).then(function(project) {
        if(!canModifyProject(req.user, project)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this project"); 

        console.log("Removing file", req.params.fileId);
        return File.findOneQ({ _id : req.params.fileId }).then(function(file){
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
            utils.sendError(res, 500, err);
        });
    }).fail(function(err) {
        res.status(400).send();
    });
};


exports.follow = function(req,res){
    req.body.follower = req.user._id;

    Project.findOneAndUpdateQ({ _id : req.body.following },{$addToSet : { followers : req.body.follower }}).then(function(project){
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
        utils.sendError(res, 400, err);
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
        utils.sendError(res, 500, err);
    })
};

exports.getByChallenge = function(req,res){
    Project.find({ container : req.params.challenge }).select('_id title poster tags accessUrl brief').populate('tags').execQ().then(function(projects){
        res.json(projects);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.fetchOne = function(req,res){
    Project.findQ({ _id : req.params.id}).then(function(project){
        res.json(project[0]);
    }).fail(function(err){
        utils.sendError(res, 400, err);
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
                utils.sendError(res, 500, err);
            })
    }else if(req.query._id) {
        switch(req.query.type){
            case 'card':
                Project.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers members owner like dislike').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    utils.sendError(res, 400, err);
                });
                break;
            case 'info':
                Project.find({_id : req.query._id}).select('_id title accessUrl').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    utils.sendError(res, 400, err);
                });
                break;
            case 'block':
                Project.find({_id : req.query._id}).select('_id title accessUrl poster').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    utils.sendError(res, 400, err);
                });
                break;
            default :
                Project.find({_id : req.query._id}).select('_id title brief accessUrl tags poster followers members owner localisation home trello showProgress progress like dislike').populate('tags').execQ().then(function(data){
                    res.json(data);
                }).catch(function(err){
                    utils.sendError(res, 400, err);
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
                utils.sendError(res, 500, err);
            })
    }
};

exports.create = function(req,res){
    if(req.body.tags) {
        req.body.tags = _.pluck(req.body.tags, "_id");
    }

    req.body.owner = req.user._id;
    var project = new Project(req.body);

    project.saveQ().then(function(project) {
        var myNotif =  new Notification({
            type : 'create',
            owner : project.owner,
            entity :  project._id,
            entityType : 'project'
        });

        return myNotif.saveQ().then(function() {
            return tagController.updateTagCounts("project", project.tags, []);
        }).then(function() {
            if(project.container){
                return Challenge.findOneAndUpdateQ({_id : project.container},{ $addToSet : { projects : project._id },$inc : { projectNumber : 1 }});
            } else {
                // Return dummy promise
                return Q.fulfill(true);
            }
        }).then(function() {
            res.json(project);
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.update = function(req,res){
    Project.findOneQ({ _id: req.params.id }).then(function(project) {
        if(!canModifyProject(req.user, project)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this project"); 

        // Remove properties that can't be updated this way
        req.body = _.omit(req.body, "_id", "_v", "members", "followers", "likers");

        // Get just the IDs of tags
        if(req.body.tags) {
            req.body.tags = _.pluck(req.body.tags, "_id");
        }

        // Get just the ID of the owner
        if(req.body.owner) {
            req.body.owner = req.body.owner._id;
        }

        return Project.findOneAndUpdateQ({_id:req.params.id}, req.body).then(function(data) {
            var myNotif = new Notification({
                type : 'update',
                owner : req.user._id,
                entity :  data._id,
                entityType : 'project'
            });
            return myNotif.saveQ().then(function() { 
                return tagController.updateTagCounts("project", data.tags, project.tags);
            }).then(function(notif) {
                res.json(data);
            });
        }).fail(function(err){
            utils.sendError(res, 400, err);
        });
    }).fail(function(err) {
        res.status(400).end();
    });
};

exports.remove = function(req,res){
    Project.findOneQ({ _id: req.params.id }).then(function(project) {
        if(!canRemoveProject(req.user, project)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this project"); 

        var updateChallengeQuery = Challenge.updateQ({ _id: project.container }, { $pull: { projects: req.params.id }});
        var projectRemovalQuery = Project.removeQ({_id : req.params.id});
        var updateTagCountsQuery = tagController.updateTagCounts("project", [], project.tags);

        return q.all([updateChallengeQuery, projectRemovalQuery, updateTagCountsQuery]).then(function() {
            var myNotif = new Notification({
                type : 'remove',
                owner : req.user._id,
                entity : req.params.id,
                entityType : 'project'
            });
            return myNotif.saveQ().then(function() {
                res.status(200).send()
            });
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    })
};

exports.apply = function(req,res){
    req.body.owner = req.user._id;

    var myApply = new Apply(req.body);
    myApply.saveQ().then(function(data){
        var myNotif = new Notification({
            entity : myApply.container,
            owner : req.user._id,
            type : 'apply',
            entityType : 'project'
        });
        return myNotif.saveQ();
    }).then(function() {
        res.send(200);
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.fetchApply = function(req,res){
    Apply.findQ({ container : req.query.container }).then(function(applies){
        res.json(applies);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    })
};

exports.finishApply = function(req,res){
    Apply.findOneAndUpdateQ({ _id : req.params.id },{ status : true,accepted : req.body.accepted }).then(function(){
        res.send(200);
    }).fail(function(err){
        utils.sendError(res, 500, err);
    });
};

exports.addToTeam = function(req,res){
    Project.findOneQ({ _id: req.params.id }).then(function(project) {
        if(!canModifyProject(req.user, project)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this project"); 

        var projectId = req.params.id;
        var ownerId = req.user._id;
        var applierId = req.body.userId;

        var myNotif = new Notification({
            entity : projectId,
            owner : applierId,
            type : 'join',
            entityType : 'project'
        });

        return q.all([
            Project.findOneAndUpdateQ({ _id : projectId },{ $addToSet : { members : applierId }}),
            myNotif.saveQ()
        ]).then(function(data){
            res.send(200);
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.banFromTeam = function(req,res) {
    Project.findOneQ({ _id: req.params.id }).then(function(project) {
        if(!canModifyProject(req.user, project)) return utils.sendErrorMessage(res, 403, "You are not allowed to modify this project"); 

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
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.like = function(req, res) {
    Project.findOneAndUpdateQ({ _id : req.params.projectId },{$addToSet : { likers : req.user._id }}).then(function(project){
        var myNotif =  new Notification({
            type : 'like',
            owner : req.user._id,
            entity : project._id,
            entityType : 'project'
        });
        return myNotif.saveQ().then(function(){
            res.json(project)
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.unlike = function(req, res) {
    Project.findOneAndUpdateQ({ _id : req.params.projectId },{$pull : { likers : req.user._id }}).then(function(project){
        var myNotif =  new Notification({
            type : 'unlike',
            owner : req.user._id,
            entity : project._id,
            entityType : 'project'
        });
        return myNotif.saveQ().then(function(){
            res.json(project)
        });
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};
