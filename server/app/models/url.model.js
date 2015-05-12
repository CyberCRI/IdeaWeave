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
    description : String,
    owner : {
        type : Schema.ObjectId,
        ref:'User',
        required: "Owner is required"
    },
    project : {
        type : Schema.ObjectId,
        ref : 'Project',
        required: "Project is required"
    },
    text : String,
    title : String
});

mongoose.model('Url', UrlSchema);
