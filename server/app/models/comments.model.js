'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required : 'text cannot be blank'
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    container : {
        type: Schema.ObjectId,
        ref: 'NoteLab'
    },
    answer : [{
        type : Schema.ObjectId,
        ref : 'Comment'
    }],
    parent : {
        type : Schema.ObjectId,
        ref : 'Comment'
    },
    project : {
        type : Schema.ObjectId,
        ref : 'Project'
    }
});

mongoose.model('Comment', CommentSchema);