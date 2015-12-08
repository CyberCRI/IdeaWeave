'use strict';

var mongoose = require('mongoose-q')(),
    q = require('q'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Idea = mongoose.model('Idea'),
    Tag = mongoose.model('Tag'),
    utils = require('../services/utils.service'),
    _ = require('lodash');


exports.all = function(req,res) {
    var shouldSearch = {   
        users: false,
        projects: false,
        challenges: false,
        ideas: false,
        tags: false
    };

    function maybeSearch(item) {
        // If we don't need to search it, just return an empty array
        if(!shouldSearch[item]) return q.fulfill([]);

        var regExp = new RegExp(utils.escapeRegExp(req.query.search), "i");

        switch(item) {
            case "users":
                return User.find({ $or: [ { realname: regExp }, { username: regExp } ] })
                .select('_id poster username realname tags followers')
                .populate('tags')
                .execQ();
            case "projects":
                return Project.find({ 'title': regExp })
                .select('_id poster title tags noteNumber accessUrl')
                .populate('tags')
                .execQ();
            case "challenges":
                return Challenge.find({ 'title': regExp })
                .select('_id poster title tags projects accessUrl')
                .populate('tags')
                .execQ();
            case "ideas":
                return Idea.find({ 'title': regExp })
                .select('_id title tags projects challenges accessUrl')
                .populate('tags')
                .execQ();
            case "tags":
                return Tag.findQ({ 'title': regExp });
            default: 
                throw new Error("Unknown search item '" + item + "'");
        }
    }

    if(req.query.include) {
        // Include only what is searched
        // Convert include to array if it isn't
        if(!_.isArray(req.query.include)) req.query.include = [req.query.include];
        _.each(req.query.include, function(key) { shouldSearch[key] = true; });
    } else {
        // Include everything
        _.each(_.keys(shouldSearch), function(key) { shouldSearch[key] = true; });
    }

    q.all(_.map(["users", "projects", "challenges", "ideas", "tags"], maybeSearch))
    .then(function(data){
        var response = {
            users: data[0],
            projects: data[1],
            challenges: data[2],
            ideas: data[3],
            tags: data[4]
        };

        res.json(response);
    }).catch(function(err){
        utils.sendError(res, 400, err);
    })
};
