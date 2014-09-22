'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActionSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: 'title cannot be blank'
    },
    url : {
        type: String,
        required : 'url cannot be blank'
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required : 'owner is required'
    },
    container : {
        type: Schema.ObjectId,
        ref: 'Project',
        required : 'container is required'
    },
    vote : {
        type : Number
    }
});

mongoose.model('Action', ActionSchema);