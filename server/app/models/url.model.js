'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Url Schema
 */
var UrlSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    container : {
        type : Schema.ObjectId,
        ref : 'NoteLab'
    },
    description : String,
    owner : {
        type : Schema.ObjectId,
        ref:'User'
    },
    project : {
        type : Schema.ObjectId,
        ref : 'Project'
    },
    text : String,
    title : String
});

mongoose.model('Url', UrlSchema);