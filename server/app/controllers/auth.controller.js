'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(),
	User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
	_ = require('lodash'),
    request = require('request'),
    qs = require('querystring'),
    utils = require('../services/utils.service'),
    config = require('../../config/config');


/**
 * Signup
 */
exports.signup = function(req, res) {
	// Init Variables
    var tagsId = [];
    if(req.body.tags){
        req.body.tags.forEach(function(tag,k){
            tagsId.push(tag._id)
        });
        req.body.tags = tagsId;
    }
	var user = new User(req.body);
	// Then save the user
	user.saveQ().then(function(err) {
        if(user.tags){
            user.tags.forEach(function(tagId,k){
                Tag.updateQ({_id : tagId},{ $inc : {number : 1} }).then(function(data){

                }).fail(function(err){
                    res.send(400, err);
                });
            });
        }
        res.json({
            message : 'ok'
        })

	}).fail(function(err){
        return res.json(400, err);
    });
};


exports.signin = function(req, res) {
    User.findOne({ email: req.body.email }).populate('tags').exec(function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Wrong email and/or password' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            }
            user = user.toObject();
            delete user.password;
            var token = utils.createJwtToken(user);
            res.send({ token: token });
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
    request.post(accessTokenUrl, { json: true, form: params }, function(error, response, token) {
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
                    res.send({ token: token });
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
                    res.json(500,err);
                });
            }).catch(function(err){
                res.json(400,err);
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

exports.personnaAuth = function(req,res){

};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.send(400, err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.send(400, {
			message: 'User is not signed in'
		});
	}
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
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
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