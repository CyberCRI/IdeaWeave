/**
 * Module dependencies
 */
var mongoose = require('mongoose-q')(),
	Idea = mongoose.model('Idea'),
	User = mongoose.model('User'),
	Challenge = mongoose.model('Challenge'),
	Project = mongoose.model('Project'),
	Tags = mongoose.model('Tag'),
	Notification = mongoose.model('Notification'),
	io = require('../../server').io,
	_ = require('lodash'),
	q = require('q');

function canModifyIdea(user, idea) {
	return user._id.toString() == idea.owner.toString();
};

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
			type : 'create',
			owner : idea.owner,
			entity : idea._id,
			entityType : 'idea'
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
	Idea.findOneQ({_id : req.params.id}).then(function(idea) {
		if(!canModifyIdea(req.user, idea)) {
			return res.json(403, "You are not allowed to modify this idea");
		};
		idea.brief = req.body.brief;
		idea.language = req.body.language;
		idea.tags = req.body.tags;
		idea.modifiedDate = new Date();
		idea.saveQ().then(function(modifiedIdea) {
			var myNotif = new Notification({
				type : 'update',
				owner : modifiedIdea.owner,
				entity : modifiedIdea._id,
				entityType : 'idea'
			});
			myNotif.saveQ().then(function() {
				res.json(200, modifiedIdea);
			});
		}).fail(function(err) {
			res.json(400, err);
		});
	});
};

exports.remove = function(req, res) {
	Idea.findOneAndRemoveQ({_id : req.params.id}).then(function(idea) {
		var myNotif = new Notification({
			type : 'remove',
			owner : idea.owner,
			entity : idea._id,
			entityType : 'idea'
		});
		myNotif.saveQ().then(function() {
			res.json(idea);
		});
	}).fail(function(err) {
		res.json(400, err);
	});
};

exports.follow = function(req, res) {
	Idea.findOneAndUpdateQ({_id : req.params.id}, 
		{$push : {followers : req.body.follower}})
		.then(function(idea) {
			var myNotif = new Notification({
				type : 'follow',
				owner : req.body.follower,
				entity : idea._id,
				entityType : 'idea'
			});
			myNotif.saveQ().then(function() {
				res.json(idea);
			}).fail(function(err) {
				res.json(400, err);
			});
		}).fail(function(err) {
			res.json(400, err);
		});
};

exports.unfollow = function(req, res) {
	Idea.findOneAndUpdateQ({_id : req.params.id},
		{$pull : {followers : req.body.follower}})
		.then(function(idea) {
			var myNotif = new Notification({
				type : 'unfollow',
				owner : req.body.follower,
				entity : idea._id,
				entityType : 'idea'
			});
			myNotif.saveQ().then(function() {
				res.json(idea);
			});
		}).fail(function(err) {
			res.json(400, err);
		});
};

exports.like = function(req, res) {
	User.findOneQ({_id : req.body.liker}).then(function(user) {
		if(user.likes.indexOf(req.params.id) < 0) {
			Idea.findOneQ({_id : req.params.id})
				.then(function(idea) {
					if(user.dislikes.indexOf(req.params.id) < 0) {
						idea.likes = idea.likes + 1;
						idea.saveQ();
						User.findOneAndUpdateQ({_id : req.body.liker}, 
							{$push : {likes : req.params.id}});
					}
					else {
						idea.likes = idea.likes + 1;
						idea.dislikes = idea.dislikes - 1;
						idea.saveQ();
						User.findOneAndUpdateQ({_id : req.body.liker},
							{$push : {likes : req.params.id},
							$pull : {dislikes : req.params.id}});
					};
					var myNotif = new Notification({
						type : 'like',
						owner : req.body.liker,
						entity : idea._id,
						entityType : 'idea'
					});
					myNotif.saveQ().then(function() {
						res.json(idea);
					});
				}).fail(function(err) {
					res.json(400, err);
				});
		}
		else {
			res.json("already liked");
		};
	});
};

exports.getLikes = function(req, res) {
	Idea.findOneQ({_id : req.params.id}).then(function(idea) {
		res.json(idea.likes.toString());
	});
};

exports.dislike = function(req, res) {
	User.findOneQ({_id : req.body.disliker}).then(function(user) {
		if(user.dislikes.indexOf(req.params.id) < 0) {
			Idea.findOneQ({_id : req.params.id})
				.then(function(idea) {
					if(user.likes.indexOf(req.params.id) < 0) {
						idea.dislikes = idea.dislikes + 1;
						idea.saveQ();
						User.findOneAndUpdateQ({_id : req.body.disliker}, 
							{$push : {dislikes : req.params.id}});
					}
					else {
						idea.dislikes = idea.dislikes + 1;
						idea.likes = idea.likes - 1;
						idea.saveQ();
						User.findOneAndUpdateQ({_id : req.body.disliker},
							{$push : {dislikes : req.params.id},
							$pull : {likes : req.params.id}});
					};
					var myNotif = new Notification({
						type : 'dislike',
						owner : req.body.disliker,
						entity : idea._id,
						entityType : 'idea'
					});
					myNotif.saveQ().then(function() {
						res.json(idea);
					});
				}).fail(function(err) {
					res.json(400, err);
				});
		}
		else {
			res.json("already disliked");
		};
	});
};

exports.getDislikes = function(req, res) {
	Idea.findOneQ({_id : req.params.id}).then(function(idea) {
		res.json(idea.dislikes.toString());
	});
};
