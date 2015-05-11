'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema,
    Q = require('q');

/**
 * Article Schema
 */
var ChallengeSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    accessUrl : {
        type : String,
        required : true
    },
    title: {
        type: String,
        default: '',
        required: 'Title cannot be blank'
    },
    brief: {
        type: String,
        default: ''
    },
    webPage : {
        type : String
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    startDate : {
        type: Date,
        default: Date.now
    },
    EndDate : {
        type: Date
    },
    follow : {
        type : Number,
        default : 0
    },
    localisation : {},
    poster : {
        type : String
    },
    banner : {
        type : String
    },
    home : {
        type : String,
        default : ''
    },
    followers : [
        {
            type: Schema.ObjectId,
            ref: 'User',
            unique : true
        }
    ],
    projects : [
        {
            type: Schema.ObjectId,
            ref: 'Project',
            unique : true
        }
    ],
    projectNumber : {
        type : Number,
        default : 0
    },
    tags : [{
        type : Schema.ObjectId,
        ref : 'Tag',
        unique : true
    }],
    noteNumber : {
        type : Number,
        default : 0
    }
});
ChallengeSchema.statics.random = function() {
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
mongoose.model('Challenge', ChallengeSchema);