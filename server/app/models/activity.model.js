'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        default: '',
        required: 'action cannot be blank'
    },
    entity: {
        type: String,
        required : 'entity cannot be blank'
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Activity', ActivitySchema);