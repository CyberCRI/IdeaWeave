'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        required: 'Message cannot be blank'
    },
    subject: {
        type: String,
        required : 'subject cannot be blank'
    },
    read : {
        type : Boolean,
        default : false
    },
    from: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    to : {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Message', MessageSchema);