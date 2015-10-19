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
        required: 'Title cannot be blank',
        unique: true
    },
    number: {
        type: Number,
        default: 0
    },    
    followers: [{
        type: Schema.ObjectId,
        ref: 'User',
        unique: true
    }]
});

// Put tags into lowercase, and trim
TagSchema.pre('save', function(next) {
    this.title = this.title.trim().toLowerCase();
    next();
});

mongoose.model('Tag', TagSchema);
