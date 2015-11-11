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
    userCount: {
        type: Number,
        default: 0
    },    
    challengeCount: {
        type: Number,
        default: 0
    },    
    projectCount: {
        type: Number,
        default: 0
    },    
    ideaCount: {
        type: Number,
        default: 0
    },
    // This is automatically calculated as the sum of the other "*Count" properties
    entityCount: {
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
    this.ideaCount = this.userCount + this.challengeCount + this.projectCount + this.ideaCount;
    next();
});

mongoose.model('Tag', TagSchema);
