'use strict';

var fs = require('fs'),
    q = require('q'),
    mongoose = require('mongoose-q')(),
    File = mongoose.model('File'),
    Url = mongoose.model('Url'),
    NoteLab = mongoose.model('NoteLab'),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Notification = mongoose.model('Notification'),
    HackPadClient = require('../controllers/hackPad.controller').client,
    io = require('../../server').io;


// Return if the current user is allowed to modify the given note
function canModifyNote(user, note) {
    // Cast both to strings in order to avoid ObjectID differences
    // TODO: Allow project or challenge owners to modify other's notes?
    return note.owner.toString() == user._id.toString();
}

// NOTES
exports.listNotes = function(req,res){
    if(req.query.project){
        NoteLab.findQ({ project : req.query.project }).then(function(notes){
            res.json(notes);
        }).fail(function(err){
            res.json(500, err);
        });
    } else if(req.query.challenge) {
        NoteLab.findQ({ challenge : req.query.challenge }).then(function(notes){
            res.json(notes);
        }).fail(function(err){
            res.json(500, err);
        });        
    } else {
        res.json(403, "Please specify a project or challenge");
    }
};

exports.fetchNote = function(req,res){
    NoteLab.findOneQ({ _id : req.params.id }).then(function(note){
        if(!note) return res.send(400);
        res.json(note);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.createNote = function(req,res){
    // Notes are attached to projects or challenges
    var containerUpdateQuery;
    if(req.body.project){
        containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.body.project},{$inc:{noteNumber : 1}});
    } else if(req.body.challenge) {
        containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.body.challenge},{$inc:{noteNumber : 1}});
    } else {
        res.json(403, "Please specify a project or challenge");
    }

    // TODO: Check that the current user can write notes in this project or challenge (is owner or contributor)

    // Note will be owned by the current user
    var newNote = new NoteLab(req.body);
    newNote.owner = req.user._id; 

    q.all([newNote.saveQ(), containerUpdateQuery]).then(function(data) {
        res.json(200, data[0]);
    }).fail(function(err) {
        res.json(400,err);
    });
};

exports.updateNote = function(req,res){
    // Get the current note
    NoteLab.findOneQ({ _id : req.params.id }).then(function(note){
        if(!note) return res.send(400);
        if(!canModifyNote(req.user, note)) return res.json(403, "You are not allowed to modify this note");

        // Update the text and modification date
        note.text = req.body.text;
        note.modifiedDate = new Date();
        note.increment();

        note.saveQ().then(function(newNote) {
            res.json(200, newNote);
        }).fail(function(err){
            res.json(500,err);
        });
    }).fail(function(err){
        res.json(500,err);
    });
};

exports.removeNote = function(req,res){
    // Get the current note
    NoteLab.findOneQ({ _id : req.params.id }).then(function(note){
        if(!note) return res.send(400);
        if(!canModifyNote(req.user, note)) return res.json(403, "You are not allowed to modify this note");

        // Notes are attached to projects or challenges
        var containerUpdateQuery;
        if(note.project){
            containerUpdateQuery = Project.findOneAndUpdateQ({_id:req.body.project},{$dec:{noteNumber : 1}});
        } else if(note.challenge) {
            containerUpdateQuery = Challenge.findOneAndUpdateQ({_id:req.body.challenge},{$dec:{noteNumber : 1}});
        } else {
            res.json(500, "Note does not specify a project or challenge");
        }

        q.all([note.removeQ(), containerUpdateQuery]).then(function() {
            res.send(200);
        }).fail(function(err){
            res.json(500,err);
        });
    }).fail(function(err){
        res.json(500,err);
    });
};

//comment

exports.listComments = function(req,res){
    Comment.find({ container : req.query.container })
        .sort({ 'createDate' : 1})
        .populate('answer')
        .execQ()
        .then(function(notes){
            var response = [];
            notes.forEach(function(note,key){
                if(!note.parent){
                    response.push(note)
                }
            });
            res.json(response);
        }).fail(function(err){
            res.json(500,err);
        })
};

exports.fetchComment = function(req,res){
    Comment.find({ container : req.query.container })
        .sort({ 'createDate' : 1})
        .populate('answer')
        .execQ()
        .then(function(notes){
            var response = [];
            notes.forEach(function(note,key){
                if(!note.parent){
                    response.push(note)
                }
            });
            res.json(response);
        }).fail(function(err){
            res.json(500,err);
        })
};

exports.createComment = function(req,res){
    var myComment = new Comment(req.body);
    myComment.saveQ().then(function(comment){
        var myNotif =  new Notification({
            type : 'comment',
            owner : comment.owner,
            entity : comment._id,
            container : comment.container,
            project : comment.project
        });
        q.all([
            myNotif.saveQ(),
            Comment.findOneAndUpdateQ({ _id : comment.parent },{$push : { answer : comment._id }})
        ]).then(function(data){
            io.sockets.in('project::'+myNotif.project).emit('comment',data[0]);
            io.sockets.emit('notelab_'+comment.container+'::newComment',comment);
            res.send(200);
        }).fail(function(err){
            res.json(500,err);
        })
    }).fail(function(err){
        res.json(500,err);
    });
};

exports.updateComment = function(req,res){

};

exports.removeComment = function(req,res){

};


//file upload
exports.fetchFile = function(req,res){
    if(req.query.projectUrl){
        Project.find({accessUrl : req.query.projectUrl}).populate('_id').execQ().then(function(project){
            File.find({ project : project[0]._id}).execQ().then(function(files){
                res.json(files);
            }).fail(function(err){
                res.json(500,err);
            })
        })
    }else{
        File.find({ container : req.query.container }).execQ().then(function(files){
            res.json(files);
        }).fail(function(err){
            res.json(500,err);
        })
    }
};

exports.upload = function(req,res) {

    if (req.files) {
;
        fs.exists(req.files.file.path, function (exists,err) {
            if (exists) {
                fs.rename(req.files.file.path,'public/workspaceFile/'+req.files.file.name,function(err){
                    console.log(err)
                    if(!err){
                        var myFile = new File(req.files.file);
                        myFile.url = 'http://ideastorm.io:5011/workspaceFile/'+req.files.file.name;
                        myFile.type = req.files.file.mimetype;
                        myFile.owner = req.body.owner;
                        myFile.descripion = req.body.description;
                        myFile.container = req.body.container;
                        myFile.project = req.body.project;
                        myFile.saveQ().then(function(data){
                            var myNotif =  new Notification({
                                type : 'noteLabF',
                                owner : data.owner,
                                entity : data._id,
                                container : data.container
                            });
                            myNotif.saveQ().then(function(notif){
                                io.sockets.in('project::'+myFile.project).emit('file',notif);
                                res.json(data);
                            }).catch(function(err){

                                res.json(400,err)
                            })
                        }).fail(function(err){

                            res.json(500,err);
                        });
                    }else{
;
                        res.json(400,err)
                    }
                });
            } else {
;
                res.json(400,err)
            }
        },function(err){
            res.json(400,err)
        });
    }
};
exports.updateFile = function(req,res){

};

exports.removeFile = function(req,res){

};


exports.fetchUrl = function(req,res){
//url ressources
    if(req.query.projectUrl){
        Project.find({accessUrl : req.query.projectUrl}).populate('_id').execQ().then(function(project) {
            Url.findQ({ project : project[0]._id}).then(function(urls){
                res.json(urls);
            }).fail(function(err){
                res.json(500,err);
            })
        })
    }else{
        Url.findQ({ container : req.params.id}).then(function(urls){
            res.json(urls);
        }).fail(function(err){
            res.json(500,err);
        })
    }
};

exports.createUrl = function(req,res){
    var myUrl = new Url(req.body);
    myUrl.saveQ().then(function(data){
        var myNotif =  new Notification({
            type : 'noteLabU',
            owner : data.owner,
            entity : data._id,
            container : data.container
        });
        myNotif.saveQ().then(function(notif){
            io.sockets.in('project::'+req.body.project).emit('url',notif);
            res.json(data);
        }).catch(function(err){
            res.json(500,err);
        });
        res.json(data);
    }).fail(function(err){
        res.json(500,err);
    })
};

exports.updateUrl = function(req,res){

};

exports.removeUrl = function(req,res){

};
