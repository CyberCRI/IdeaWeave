'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ChatSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    container: {
        type: Schema.ObjectId,
        ref: 'Challenge'
    }
});

mongoose.model('Chat', ChatSchema);