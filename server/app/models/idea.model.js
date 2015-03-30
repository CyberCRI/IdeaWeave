/**
 * Module dependencies
 */
 var mongoose = require('mongoose-q')(),
 	 Schema = mongoose.Schema,
 	 Q = require('q');

/**
 * Article Schema
 */
var IdeaSchema = new Schema({
	createDate : {
		type : Date,
		default : Date.now
	},
	modifiedDate : {
		type : Date,
		default : Date.now
	},
	title : {
		type : String,
		default : '',
		required : 'Title cannot be blank'
	},
	brief : {
		type : String,
		default : ''
	},
	owner : {
		type : Schema.ObjectId,
		ref : 'User'
	},
	language : {
		type : String,
		default : 'English',
		required : 'A language needs to be selected'
	},
	likes : [
		{
			type : Schema.ObjectId,
			ref : 'User',
			unique : true
		}
	],
	dislikes : [
		{
			type : Schema.ObjectId,
			ref : 'User',
			unique : true
		}
	],
	followers : [
		{
			type : Schema.ObjectId,
			ref: 'User',
			unique : true
		}
	],
	projects : [
		{
			type : Schema.ObjectId,
			ref : 'Project',
			unique : true
		}
	],
	challenges : [
		{
			type : Schema.ObjectId,
			ref : 'Challenge',
			unique : true
		}
	],
	tags : [
		{
			type : Schema.ObjectId,
			ref : 'Tag',
			unique : true
		}
	]
});

IdeaSchema.statics.random = function() {
	var defered = Q.defer()
	this.count(function(err, count) {
		if(err) {
			defered.reject(err);
		}
		var rand = Math.floor(Math.random() * count);
		console.log(rand)
		this.find().skip(rand).limit(4).exec(function(err, user) {
			if(err) {
				defered.reject(err);
			}
			else {
				defered.resolve(user)
			}
		});
	}.bind(this));
	return defered.promise;
};
mongoose.model('Idea', IdeaSchema);