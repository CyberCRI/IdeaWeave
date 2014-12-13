var mongoose = require('mongoose-q')(),
    User = mongoose.model('User'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
    moment = require('moment');


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
        res.json(err);
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