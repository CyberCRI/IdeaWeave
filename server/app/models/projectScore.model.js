'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Projectscore Schema
 */
var ProjectscoreSchema = new Schema({
    topicNum: {
        type: Number,
        default: 0
    },
    linkNum: {
        type: Number,
        default: 0
    },
    commentNum: {
        type: Number,
        default: 0
    },
    applyTeamNum: {
        type: Number,
        default: 0
    },
    followerNum: {
        type: Number,
        default: 0
    },
    pid: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Projectscore', ProjectscoreSchema);