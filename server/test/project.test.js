process.env.NODE_ENV = "development"

var should = require('should'),
    request = require('supertest'),
    User = require('../app/models/user.model'),
    mongoose = require('mongoose-q')(),
    config = require('../config/config');
