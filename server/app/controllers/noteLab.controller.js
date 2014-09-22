'use strict';

var fs = require('fs'),
    q = require('q'),
    mongoose = require('mongoose-q')(),
    File = mongoose.model('File'),
    Url = mongoose.model('Url'),
    NoteLab = mongoose.model('NoteLab'),
    Project = mongoose.model('Project'),
    Comment = mongoose.model('Comment'),
    Notification = mongoose.model('Notification'),
    HackPadClient = require('../controllers/hackPad.controller').client,
    io = require('../../server').io;


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

//note
exports.fetchNote = function(req,res){
    console.log(1,req.query)
    if(req.query.projectUrl){
        Project.find({accessUrl : req.query.projectUrl}).populate('_id').execQ().then(function(project) {
            console.log(2,project)
            NoteLab.findQ({ project : project[0]._id }).then(function(notes){
                console.log(3,notes)
                res.json(notes);
            }).fail(function(err){
                res.json(500,err);
            })
        })
    }else if(req.query.id){
        NoteLab.findQ({ _id : req.query.id }).then(function(notes){
            res.json(notes);
        }).fail(function(err){
            res.json(500,err);
        })
    }
};

exports.createNote = function(req,res){
    var myNote = new NoteLab(req.body);
        q.all([
        myNote.saveQ(),
        Project.findOneAndUpdateQ({_id:req.body.project},{$inc:{noteNumber : 1}})
    ]).then(function(data){
        var myNotif =  new Notification({
            type : 'note',
            owner : data[0].owner,
            entity : data[0]._id,
            container : data[0].project
        });
        myNotif.saveQ().then(function(notif){
            console.log('la')
            HackPadClient.create(data[0].text,'text/html',function(err,resp){
                if(err){
                    console.log(1,err)
                    res.json(400,err);
                }else{
                    NoteLab.findOneAndUpdateQ({ _id  :data[0]._id },{ hackPadId : resp.padId }).then(function(note){
                        io.sockets.in('project::'+req.body.project).emit('newNote',notif,note);
                        res.send(200);
                    }).fail(function(err){
                        console.log(2,err)
                        res.json(400,err)
                    })
                }
            });
        }).fail(function(err){
            console.log(3,err)
            res.json(400,err);
        });
    }).fail(function(err){
        console.log(4,err)
        res.json(400,err);
    });
};

exports.updateNote = function(req,res){

};

exports.removeNote = function(req,res){

};

//comment

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