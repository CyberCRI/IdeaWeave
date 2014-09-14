'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Forum Schema
 */
var NoteLabSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    public : {
        type : Boolean,
        defaults : false
    },
    hackPadId : {
        type : String
    },
    type : {
        type : String,
        required : true
    },
    title: {
        type: String,
        default: '',
        required: 'Title cannot be blank'
    },
    text: {
        type: String,
        required : 'text cannot be blank'
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    project : {
        type : Schema.ObjectId,
        ref : 'Project'
    }
});

mongoose.model('NoteLab', NoteLabSchema);