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
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required : 'text cannot be blank'
    }
});

/**
 * Forum Schema
 */
var NoteLabSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'Notes must have owners'
    },
    project: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    challenge: {
        type: Schema.ObjectId,
        ref: 'Challenge'
    },
    idea: {
        type: Schema.ObjectId,
        ref: 'Idea'
    },
    text: {
        type: String,
        required: 'text cannot be blank'
    },
    comments: [CommentSchema]
});

mongoose.model('NoteLab', NoteLabSchema);
