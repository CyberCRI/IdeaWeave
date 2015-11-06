'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash'),
    q = require('q'),
    request = require('request'),
    qs = require('querystring'),
    utils = require('../services/utils.service'),
    config = require('../../config/config'),
    emailer = require('../services/mailer.service'),
    tagController = require('../controllers/tag.controller');


/**
 * Signup
 */
exports.signup = function(req, res) {
    // Check that no user already has that email
    User.findOneQ({ email: req.body.email })
    .then(function(existingUser) {
        if(existingUser) throw new Error("A user already has that email");

        if(req.body.tags) req.body.tags = _.pluck(req.body.tags, "_id");
        else req.body.tags = [];

        var user = new User(req.body);
        // Then save the user
        user.saveQ().then(function(user) {
            // Follow chosen tags
            var tagUpdateRequests = _.map(req.body.tags, function(tagId) {
                return Tag.findOneAndUpdateQ({ _id: tagId }, { $push: { followers: user._id }});
            });
            return q.all(tagUpdateRequests);
        }).then(function() {
            return tagController.updateTagCounts("user", user.tags || [], []);
        });
    }).then(function() {
        res.status(200).send();
    }).fail(function(err){
        utils.sendError(res, 400, err);
    });
};


exports.signin = function(req, res) {
    User.findOne({ email: req.body.email }).populate('tags').exec(function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Wrong email and/or password' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err || !isMatch) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            }
            user = user.toObject();
            delete user.password;
            var token = utils.createJwtToken(user);
            res.send({ token: token, user_id: user._id });
        });
    });

};

exports.googleAuth = function(req, res) {
    console.log('google')
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.GOOGLE_SECRET,
        code: req.body.code,
        grant_type: 'authorization_code'
    };
// Step 1. Exchange authorization code for access token.
    console.log("Requesting google auth token", accessTokenUrl, params);
    request.post(accessTokenUrl, { json: true, form: params }, function(error, response, token) {
        if(error || token.error) {
            console.error("Error getting auth token", error || token.error);
            return res.send(400, error || token.error);
        }

        console.log("Received google token");
        var accessToken = token.access_token;
        var headers = { Authorization: 'Bearer ' + accessToken };
// Step 2. Retrieve information about the current user.
        request.get({ url: peopleApiUrl, headers: headers, json: true }, function(error, response, profile) {
            console.log('profile',profile,token)
            User.findOne({ google: profile.sub }).populate('tags').exec(function(err, user) {
                console.log(err,user)
                if (user) {
                    var token = utils.createJwtToken(user);
                    return res.json({ token: token });
                }
                user = new User({
                    google: profile.sub,
                    username: profile.name,
                    email: profile.email,
                    poster : profile.picture
                });
                user.saveQ(function() {
                    var token = utils.createJwtToken(user);
                    return res.json({ token: token });
                });
            });
        });
    });
};

exports.githubAuth = function(req, res) {
    console.log(config);

    console.log(req.body)
    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.GITHUB_SECRET,
        code: req.body.code
    };
// Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params }, function(error, response, accessToken) {
        accessToken = qs.parse(accessToken);
        var headers = { 'User-Agent': 'Satellizer' };
// Step 2. Retrieve information about the current user.
        request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, function(error, response, profile) {
            User.find({ github: profile.id }).populate('tags').select('-poster -brief').execQ().then(function(user) {
                if (user[0]) {
                    var token = utils.createJwtToken(user[0]);
                    return res.send({ token: token });
                }
                user = new User({
                    github: profile.id,
                    username: profile.name
                });
                user.saveQ().then(function() {
                    var token = utils.createJwtToken(user);
                    res.send({ token: token });
                }).catch(function(err){
                    utils.sendError(res, 500, err);
                });
            }).catch(function(err){
                utils.sendError(res, 400, err);
            })
        });
    });
};

exports.twitterAuth = function(req,res){
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';
    if (!req.query.oauth_token || !req.query.oauth_verifier) {
        var requestTokenOauth = {
            consumer_key: config.TWITTER_KEY,
            consumer_secret: config.TWITTER_SECRET,
            callback: config.TWITTER_CALLBACK
        };
// Step 1. Obtain request token for the authorization popup.
        request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
            var oauthToken = qs.parse(body);
            var params = qs.stringify({ oauth_token: oauthToken.oauth_token });
// Step 2. Redirect to the authorization screen.
            res.redirect(authenticateUrl + '?' + params);
        });
    } else {
        var accessTokenOauth = {
            consumer_key: config.TWITTER_KEY,
            consumer_secret: config.TWITTER_SECRET,
            token: req.query.oauth_token,
            verifier: req.query.oauth_verifier
        };
// Step 3. Exchange oauth token and oauth verifier for access token.
        request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, profile) {
            profile = qs.parse(profile);
// Step 4a. If user is already signed in then link accounts.
            if (req.headers.authorization) {
                User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
                    }
                    var token = req.headers.authorization.split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    User.findById(payload.sub, function(err, user) {
                        if (!user) {
                            return res.status(400).send({ message: 'User not found' });
                        }
                        user.twitter = profile.user_id;
                        user.displayName = user.displayName || profile.screen_name;
                        user.save(function(err) {
                            res.send({ token: createToken(req, user) });
                        });
                    });
                });
            } else {
// Step 4b. Create a new user account or return an existing one.
                User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
                    if (existingUser) {
                        return res.send({ token: createToken(req, existingUser) });
                    }
                    var user = new User();
                    user.twitter = profile.user_id;
                    user.displayName = profile.screen_name;
                    user.save(function(err) {
                        res.send({ token: createToken(req, user) });
                    });
                });
            }
        });
    }
};

exports.forgotPassword = function(req, res) {
    // From http://stackoverflow.com/a/1349426/209505
    function makeToken(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    // Make a unique token for the given user and store it in the DB
    var token = makeToken(5);
    User.findOneAndUpdateQ({ email : req.body.email }, { passwordResetToken: token })
    .then(function(user) {
        if(!user) return utils.sendErrorMessage(res, 400, "No user with that email found");

        // Send the token to the user via email
        var email = {
            to: user.username + " <" + user.email + ">",
            subject: "IdeaWeave: Reset your password",
            text: "In order to change your password on IdeaWeave, please use the token: " + token
        }; 
        return emailer(email)
        .then(function(info) {
            console.log("Forgot password email sent", info);
            res.send(200);
        });
    }).catch(function(err){
        utils.sendError(res, 400, err);
    });
};

exports.resetPassword = function(req, res) {
    // Check that the token matches the email provided
    User.findOneQ({ email: req.body.email })
    .then(function(user) {
        if(!user) return utils.sendErrorMessage(res, 400, "No user that email found");

        // Check that the token matches the user
        if(!user.passwordResetToken || user.passwordResetToken !== req.body.token) {
            return utils.sendErrorMessage(res, 400, "The token does not match the email provided");
        } 

        user.passwordResetToken = null;
        user.password = req.body.newPassword;
        user.saveQ().then(function() {
            return res.send(200);
        });
    }).catch(function(err) {
        utils.sendError(res, 500, err);
    });
};


/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
    // Init Variables
    var passwordDetails = req.body;
    var message = null;

    if (req.user) {
        User.findOneQ({_id : req.user.id}).then(function(user) {
            if (user) {
                if (user.authenticate(passwordDetails.currentPassword)) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;

                        user.saveQ().then(function(err) {
                            req.login(user, function(err) {
                                if (err) {
                                    res.send(400, err);
                                } else {
                                    res.send({
                                        message: 'Password changed successfully'
                                    });
                                }
                            });
                        }).fail(function(err){
                            return res.send(400, {
                                message: getErrorMessage(err)
                            });
                        });
                    } else {
                        res.send(400, {
                            message: 'Passwords do not match'
                        });
                    }
                } else {
                    res.send(400, {
                        message: 'Current password is incorrect'
                    });
                }
            } else {
                res.send(400, {
                    message: 'User is not found'
                });
            }
        }).fail(function(err){

        });
    } else {
        res.send(400, {
            message: 'User is not signed in'
        });
    }
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.send(req.user);
};


exports.fetchAll = function(req,res){
    User.find().populate('tags').exec(function(users){
        res.json(users);
    })
};

exports.fetch = function(req,res){

    User.findOne({ _id : req.params.id }).populate('tags').exec(function(user){
        res.json(user);
    })
};