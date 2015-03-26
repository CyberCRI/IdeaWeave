/**
 * Module dependencies
 */
var mongoose = require('mongoose-q')(),
	Idea = mongoose.model('Idea'),
	Challenge = mongoose.model('Challenge'),
	Project = mongoose.model('Project'),
	Tags = mongoose.model('Tag'),
	Notification = mongoose.model('Notification'),
	io = require('../../server').io,
	_ = require('lodash'),
	q = require('q');

exports.fetchOne = function(req, res) {
	Idea.findOneQ({_id : req.params.id}).then(function(idea) {
		res.json(idea);
	}).fail(function(err) {
		res.json(400, err);
	});
};

exports.fetch = function(req, res) {
	if(req.query.accessUrl) {
		Idea
			.find({accessUrl : req.query.accessUrl})
			.populate('tags')
			.populate('followers')
			.populate('owner')
			.execQ()
			.then(function(idea) {
				res.json(idea);
			}).catch(function(err) {
				res.json(500, err);
			});
	}
	else {
		Idea
			.find()
			.populate('tags')
			.execQ()
			.then(function(idea) {
				res.json(idea);
			}).fail(function(err) {
				res.json(500, err);
			});
	};
};

exports.create = function(req, res) {
	if(req.body.tags) {
		var tagsId = [];
		req.body.tags.forEach(function(tag, k) {
			tagsId.push(tag._id);
		});
		req.body.tags = tagsId;
	};

	var idea = new Idea(req.body);
	idea.saveQ().then(function(idea) {
		var myNotif = new Notification({
			type : 'idea',
			owner : idea.owner,
			entity : idea._id
		});
		console.log("Saving notification...");
		myNotif.saveQ().then(function(notif) {
			console.log("Saving notification.");
			io.sockets.emit('newIdea', notif);
			console.log("Sent notification.");
			res.json(idea);
		}).fail(function(err) {
			res.json(500, err);
		});
	}).fail(function(err) {
		res.json(400, err);
	});
};

exports.update = function(req, res) {
	Idea.findOneAndUpdateQ({_id : req.params.id}, req.body).then(function(data) {
		res.json(data);
	}).fail(function(err) {
		res.json(400, err);
	});
};

exports.remove = function(req, res) {
	Idea.findOneAndRemoveQ({_id : req.params.id}).then(function(data) {
		res.json(data);
	}).fail(function(err) {
		res.json(400, err);
	});
};