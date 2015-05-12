'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * File Schema
 */
var FileSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    project : {
        type : Schema.ObjectId,
        ref : 'Project'
    },
    description : String,
    owner : {
        type : Schema.ObjectId,
        ref: 'User'
    },
    name : String,
    originalName: String,
    size : Number,
    type : String
});

mongoose.model('File', FileSchema);