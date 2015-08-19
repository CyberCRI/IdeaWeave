var nodemailer = require("nodemailer"),
    _ = require("lodash"),
    config = require('../../config/config'),
    q = require('q');

var transporter = nodemailer.createTransport(config.email.transport);

function sendMail(options) {
    var options = _.defaults(options, {
        from: config.email.from 
    });

    return q.ninvoke(transporter, "sendMail", options);
}

module.exports = sendMail;
