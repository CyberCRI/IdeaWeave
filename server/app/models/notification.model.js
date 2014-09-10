'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Unotify Schema
 */
var NotificationSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        required: 'type cannot be blank'
    },
    entity: {
        type: String,
        required : 'entity cannot be blank'
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required : true
    },
    container : {
        type: String
    }
});

mongoose.model('Notification', NotificationSchema);