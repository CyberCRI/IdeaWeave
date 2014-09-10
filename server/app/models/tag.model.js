'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Tag Schema
 */
var TagSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: 'Title cannot be blank'
    },
    number: {
        type: Number,
        default: 0
    }
});

mongoose.model('Tag', TagSchema);