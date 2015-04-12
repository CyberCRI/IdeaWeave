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


// NOTES

// Return if the current user is allowed to modify the given note
function canModifyNote(user, note) {
    // Cast both to strings in order to avoid ObjectID differences
    // TODO: Allow project or challenge owners to modify other's notes?
    return note.owner.toString() == user._id.toString();
}

exports.listNotes = function(req,res){
    var query;
    if(req.query.project){
        query = NoteLab.find({ project : req.query.project });
    } else if(req.query.challenge) {
        query = NoteLab.find({ challenge : req.query.challenge });
    } else {
        return res.json(403, "Please specify a project or challenge");
    }

    query.sort("-createDate").populate("owner", "username").populate("comments.owner", "username").execQ().then(function(notes){
        res.json(notes);
    }).fail(function(err){
        res.json(500, err);
    });        

};

exports.fetchNote = function(req,res){
    NoteLab.findOne({ _id : req.params.id }).populate("owner", "username").populate("comments.owner", "username").execQ().then(function(note){
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


// COMMENTS

// Return if the current user is allowed to modify the given note
function canModifyComment(user, comment) {
    // Cast both to strings in order to avoid ObjectID differences
    // TODO: Allow project or challenge owners to modify other's comments?
    return comment.owner.toString() == user._id.toString();
}

exports.listComments = function(req,res){
    NoteLab.findOne({ _id : req.params.id }).populate("comments.owner", "username").execQ().then(function(note){
        if(!note) return res.send(400);

        res.json(note.comments);
    }).fail(function(err){
        res.json(500,err);
    });
};

exports.fetchComment = function(req,res){
    NoteLab.findOne({ _id : req.params.noteId }).populate("comments.owner", "username").execQ().then(function(note){
        if(!note) return res.send(400);

        var comment = note.comments.id(req.params.commentId);
        if(!comment) return res.send(400);

        res.json(comment);
    }).fail(function(err){
        res.json(500,err);
    });
};

exports.createComment = function(req,res){
    // Get note
    NoteLab.findOneQ({ _id : req.params.id }).then(function(note){
        if(!note) return res.send(400);

        // TODO: Check that the current user can comment notes in this project or challenge (is owner or contributor)

        // Comment will be owned by the current user
        var newComment = note.comments.create(req.body);
        newComment.owner = req.user._id; 

        note.comments.push(newComment);

        note.saveQ().then(function(data) {
            // The last comment is the one we added
            var commentData = data.comments[data.comments.length - 1];
            res.json(200, commentData);
        }).fail(function(err) {
            res.json(500,err);
        });
    }).fail(function(err){
        res.json(500,err);
    });
};

exports.updateComment = function(req,res){
    NoteLab.findOneQ({ _id : req.params.noteId }).then(function(note){
        if(!note) return res.send(400);

        var comment = note.comments.id(req.params.commentId);
        if(!comment) return res.send(400);
        if(!canModifyComment(req.user, comment)) return res.json(403, "You are not allowed to modify this comment");

        // Update the text and modification date
        comment.text = req.body.text;
        comment.modifiedDate = new Date();

        note.saveQ().then(function(data) {
            // Get the comment we modified
            var commentData = data.comments.id(req.params.commentId);
            res.json(200, commentData);
        }).fail(function(err) {
            res.json(500,err);
        });
    }).fail(function(err){
        res.json(500,err);
    });
};

exports.removeComment = function(req,res){
    NoteLab.findOneQ({ _id : req.params.noteId }).then(function(note){
        if(!note) return res.send(400);

        var comment = note.comments.id(req.params.commentId);
        if(!comment) return res.send(400);
        if(!canModifyComment(req.user, comment)) return res.json(403, "You are not allowed to modify this comment");

        comment.remove();

        note.saveQ().then(function(data) {
            res.send(200);
        }).fail(function(err) {
            res.json(500,err);
        });
    }).fail(function(err){
        res.json(500,err);
    });
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
