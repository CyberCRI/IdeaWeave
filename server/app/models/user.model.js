'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
	Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    Q = require('q');


/**
 * User Schema
 */
var UserSchema = new Schema({
	email: {
		type: String
	},
    status : {
        type : String,
        default : 0
    },
    brief : {
        type : String,
        default : ''
    },
    emailValidated : {
        type : Boolean,
        default : false
    },
    score : Number,
    sex : Number,
    tags : [{
        type : Schema.ObjectId,
        ref : 'Tag',
        unique : true
    }],
    followers : [{
        type : Schema.ObjectId,
        ref : 'User',
        unique : true
    }],
    followings : [{
        type : Schema.ObjectId,
        ref : 'User',
        unique : true
    }],
    localisation : {},
	username: {
		type: String,
		unique: true,
		trim: true
	},
    poster : {
      type : String
    },
	password: {
		type: String
	},
	salt: {
		type: String
	},
	createDate: {
		type: Date,
		default: Date.now
	},
    mailNotification : {
        type : Boolean,
        default : true
    },
    liveNotification : {
        type : Boolean,
        default : true
    },
    google: String,
    github: String,
    linkedin: String,
    twitter: String,
});

UserSchema.statics.random = function() {
    var defered = Q.defer()
    this.count(function(err, count) {
        if (err) {
            defered.reject(err);
        }
        var rand = Math.floor(Math.random() * count);
        console.log(rand)
        this.find().skip(rand).limit(4).exec(function(err,user){
            if(err){
                defered.reject(err);
            }else{
                defered.resolve(user)
            }
        });
    }.bind(this));
    return defered.promise;
};

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function(password, done) {
    try {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            done(err, isMatch);
        });
    } 
    catch(err) {
        done(err);
    }
};
/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix) {
	var _this = this,
	    possibleUsername = username + (suffix || ''),
        defered = Q.defer();

	_this.findOneQ({
		username: possibleUsername
    }).then(function (user) {
        if (!user) {
            defered.resolve(user);
//            callback(possibleUsername);
        } else {
            return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
    }).fail(function(err){
//        callback(null);
        defered.reject(err);
    })
};

module.exports = mongoose.model('User', UserSchema);