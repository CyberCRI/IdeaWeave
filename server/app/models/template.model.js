'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    Schema = mongoose.Schema;

/**
 * Message Schema
 */
var TemplateSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    title : {
        type : String
    },
    content : {
      type : String
    },
    description : {
      type : String
    },
    challenge : {
        type : Schema.ObjectId,
        ref : 'Challenge'
    }
});

mongoose.model('Template', TemplateSchema);