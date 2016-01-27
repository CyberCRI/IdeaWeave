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
    followers: [{
        type: Schema.ObjectId,
        ref: 'User',
        unique: true
    }]
});

// Automatically count total number of tag uses
TagSchema.virtual("entityCount").get(function() { 
    return this.userCount + this.challengeCount + this.projectCount + this.ideaCount;
});

TagSchema.set('toJSON', { virtuals: true });

mongoose.model('Tag', TagSchema);
