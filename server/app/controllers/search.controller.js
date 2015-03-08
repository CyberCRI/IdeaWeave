'use strict';

var mongoose = require('mongoose-q')(),
    q = require('q'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash');

exports.all = function(req,res){

    var a = req.query.search
    q.all([
        User.find().select('_id poster username realname tags followers')
            .populate('tags')
            .regex('username', new RegExp("^"+req.query.search,"i"))
            .execQ(),
        User.find().select('_id poster username realname tags followers')
            .populate('tags')
            .regex('realname', new RegExp("^"+req.query.search,"i"))
            .execQ(),
        Project.find()
            .select('_id poster title tags noteNumber accessUrl')
            .populate('tags').regex('title', new RegExp("^"+req.query.search,"i"))
            .execQ(),
        Challenge.find()
            .select('_id poster title tags projects accessUrl')
            .populate('tags')
            .regex('title', new RegExp("^"+req.query.search,"i"))
            .execQ(),
        Tag.find()
            .regex('title', new RegExp("^"+req.query.search,"i"))
            .execQ()
    ]).then(function(data){

        var response = {
            projects : data[2],
            challenges : data[3],
            users : _.uniq(data[0].concat(data[1])),
            tags : data[4]
        };

        res.json(response);
    }).catch(function(err){
        res.json(400,err);
    })
};