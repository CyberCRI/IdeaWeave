'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema,
    q = require('q');

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    accessUrl : {
        type : String
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
    home : {
        type:String,
        default :''
    },
    webPage : {
        type : String
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required : 'a project must have an owner'
    },
    localisation : {},
    poster : String,
    banner : String,
    tags : [{
        type : Schema.ObjectId,
        ref :'Tag',
        unique : true
    }],
    container : {
        type: Schema.ObjectId,
        ref: 'Challenge'
    },
    followers : [{
        type : Schema.ObjectId,
        ref : 'User',
        unique : true
    }],
    members : [{
        type : Schema.ObjectId,
        ref : 'User',
        unique : true
    }],
    trello : {
        type : String
    },
    showProgress : {
        type : Boolean,
        default : false
    },
    progress : {
        type : Number,
        default : 0
    },
    like : {
        type : Number,
        default : 0
    },
    dislike : {
        type : Number,
        default : 0
    },
    noteNumber : {
        type : Number,
        default : 0
    },
    ideas : [
        {
            type : Schema.ObjectId,
            ref : 'Idea',
            unique : true
        }
    ],
    likers: [
        {
            type: Schema.ObjectId,
            ref: 'User',
            unique: true
        }
    ]
});

ProjectSchema.statics.random = function() {
    var defered = q.defer();
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

mongoose.model('Project', ProjectSchema);