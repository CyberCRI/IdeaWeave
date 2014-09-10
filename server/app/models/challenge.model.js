'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

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
    presentation : {
        type :String,
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
    }]
});

mongoose.model('Challenge', ChallengeSchema);