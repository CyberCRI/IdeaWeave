'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

var BadgeSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required: "owner cannot be blank"
    }, 
    title: {
        type: String,
        required: 'title cannot be blank'
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: 'image cannot be blank'
    }
});

mongoose.model('Badge', BadgeSchema);


var CreditSchema = new Schema({
    badge: {
        type: Schema.ObjectId,
        ref: 'Badge',
        required: "badge cannot be blank"
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    givenByEntity: {
        type: Schema.ObjectId,
        required: true
    },
    givenByType: {
        type: String,
        required: true
    },
    givenToEntity: {
        type: Schema.ObjectId,
        required: true
    },
    givenToType: {
        type: String,
        required: true
    },
    testimonial: {
        type: String
    }
});

mongoose.model('Credit', CreditSchema);
