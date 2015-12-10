var mongoose = require('mongoose-q')(),
    User = mongoose.model('User'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    _ = require('lodash');


module.exports.ensureAuthenticated = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    if (payload.exp <= Date.now()) {
        return res.status(401).send({ message: 'Token has expired' });
    }

    User.findOneQ({ _id : payload.user }).then(function(user){
        req.user = user;
        next();
    }).fail(function(err){
        module.exports.sendError(res, 400, err);
    })
}


module.exports.createJwtToken = function(user) {
    var payload = {
        user: user._id,
        iat: moment().valueOf(),
        exp: moment().add(7, 'days').valueOf()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}


module.exports.sendError = function(res, code, error) {
    console.error("Sending error", code, error.message, error.stack);
    return res.status(code).json({ message: error.message, stack: error.stack });
}

module.exports.sendErrorMessage = function(res, code, message) {
    return module.exports.sendError(res, code, { message: message });
}

module.exports.sendMissingError = function(res) {
    return module.exports.sendErrorMessage(res, 404, "No item found with that ID");
}

// From http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
module.exports.escapeRegExp = function(str) { 
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); 
}
