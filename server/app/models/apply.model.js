'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Apply Schema
 */
var ApplySchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        default: '',
        required: 'Message cannot be blank'
    },
    status: {
        type: Boolean,
        required : 'status must be defined'
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required : true
    },
    container : {
        type: Schema.ObjectId,
        ref: 'Project',
        required : true
    },
    accepted : {
        type : Boolean,
        default : false
    }
});

mongoose.model('Apply', ApplySchema);