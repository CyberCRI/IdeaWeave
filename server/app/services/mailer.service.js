var nodemailer = require("nodemailer"),
    smtpPool = require('nodemailer-smtp-pool'),
    _ = require("lodash"),
    config = require('../../config/config'),
    q = require('q');

var transporter = nodemailer.createTransport(smtpPool(config.email.transport));

function sendMail(options) {
    var options = _.defaults(options, {
        from: config.email.from 
    });

    return q.ninvoke(transporter, "sendMail", options);
}

module.exports = sendMail;
