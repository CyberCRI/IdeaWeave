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
        type: Schema.ObjectId,
        required : 'entity cannot be blank'
    },
    entityType : {
        type : String,
        required : 'entity type cannot be blank'
    }
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required : true
    }
});

mongoose.model('Notification', NotificationSchema);