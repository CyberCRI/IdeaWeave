var etherpadApi = require('etherpad-lite-client')
    utils = require('../services/utils.service'),
    config = require('../../config/config'),
    q = require('q');

// Length of sessions in seconds
var SESSION_TIMEOUT = 60 * 60 * 24; // one day = 60 sec/min * 60 min/hour * 24 hours

function currentDateInSeconds() {
    return Math.floor(Date.now() / 1000);
};

function findSessionForGroup(sessionData, groupId) {
    for(sessionId in sessionData) {
        if(sessionData[sessionId].groupID == groupId) {
            // Found it!
            return sessionId;
        }
    }

    return null;
}

exports.getPadInfo = function(req, res) {
    function getGroupId(groupName) {
        // Start by getting the etherpad ID of the group
        return q.ninvoke(etherpad, "createGroupIfNotExistsFor", { groupMapper: groupName })
        .then(function(groupData) {
            return groupData.groupID;
        }).catch(function(err) {
            console.error("Can't retrieve group ID for group", groupName, err);
            throw err;
        });
    }

    function getGroupPadId(groupId) {
        return q.ninvoke(etherpad, "listPads", { groupID: groupId })
        .then(function(groupPads) {
            // console.log("found group pads", groupPads);
            if(groupPads.padIDs.length > 0) {
                // Pad already exists, use it
                return groupPads.padIDs[0];
            } else {
                // Pad doesn't exist, create it
                // console.log("creating group pad");
                return q.ninvoke(etherpad, "createGroupPad", { groupID: groupId, padName: "pad" })
                // and now get the name 
                .then(function(newGroupPad) {
                    // console.log("created new group pad", newGroupPad);
                    return newGroupPad.padID;
                });
            }
        }).catch(function(err) {
            console.error("Can't retrieve group pad ID for group", groupName, err);
            throw err;
        });
    }

    function getAuthorId(userId, userName) {
        // console.log("getAuthorId() userId", userId, "userName", userName);
        return q.ninvoke(etherpad, "createAuthorIfNotExistsFor", { authorMapper: userId, name: userName })
        .then(function(userData) {
            return userData.authorID;
        }).catch(function(err) {
            console.error("Can't retrieve author ID for user", userId, userName, err);
            throw err;
        });
    }

    function getSessionId(groupId, authorId) {
        // First, check if the author already has a session with the group
        return q.ninvoke(etherpad, "listSessionsOfAuthor", { authorID: authorId })
        .then(function(sessionData) {
            //console.log("found session data", sessionData);
            var existingSessionId = findSessionForGroup(sessionData, groupId);
            //console.log("found existing session", existingSessionId);
            if(existingSessionId) {
                // Check if existing session is still valid 
                if(sessionData[existingSessionId].validUntil > currentDateInSeconds()) {
                    // Yup, still good!
                    //console.log("Session still valid", existingSessionId);
                    return existingSessionId;
                } else {
                    // Remove old session
                    //console.log("Session invalid", existingSessionId);
                    return q.ninvoke(etherpad, "deleteSession", { sessionID: existingSessionId })
                    .then(function() { 
                        return createSession(groupId, authorId);
                    });
                }
            } else {
                // No session found, time to create a new one
                //console.log("No session found");
                return createSession(groupId, authorId);
            }
        }).catch(function(err) {
            console.error("Can't retrieve session ID for group", groupId, "author", authorId, err);
            throw err;
        });
    }

    function createSession(groupId, authorId) {
        // console.log("creating new session");
        var validUntil = currentDateInSeconds() + SESSION_TIMEOUT;

        return q.ninvoke(etherpad, "createSession", { authorID: authorId, groupID: groupId, validUntil: validUntil })
        .then(function(newSession) {
            // console.log("created new session", newSession);
            return newSession.sessionID;
        }).catch(function(err) {
            console.error("Can't create session for group", groupId, "author", authorId, err);
            throw err;
        });
    }

    var groupName;
    if(req.query.project){
        groupName = "project-" + req.query.project;
    } else if(req.query.challenge) {
        groupName = "challenge-" + req.query.challenge;
    } else if(req.query.idea) {
        groupName = "idea-" + req.query.idea;
    } else {
        return utils.sendErrorMessage(res, 403, "Please specify a project, challenge, or idea");
    }

    etherpad = etherpadApi.connect({
        apikey: config.etherpad.apiKey,
        host: config.etherpad.host,
        port: config.etherpad.port,
        rootPath: config.etherpad.rootPath
    });

    q.spread([getGroupId(groupName), getAuthorId(req.user._id.toString(), req.user.username)], function(groupId, authorId) {
        return q.spread([getGroupPadId(groupId), getSessionId(groupId, authorId)], function(groupPadId, sessionId) {
            // console.log("Returning etherpad session info: user", req.user._id, "author", authorId, "group", groupId, "groupPad", groupPadId, "session", sessionId);
            res.json({
                padId: groupPadId,
                sessionId: sessionId
            });
        });
    }).catch(function(err) {
        console.error('Error retrieving group, pad, or session: ', err);
        utils.sendError(res, 500, err);
    });
};

exports.getUserSessionString = function(req, res) {
    function getAuthorId(userId, userName) {
        return q.ninvoke(etherpad, "createAuthorIfNotExistsFor", { authorMapper: userId, name: userName })
        .then(function(userData) {
            return userData.authorID;
        }).catch(function(err) {
            console.error("Can't retrieve author ID for user", userId, userName, err);
            throw err;
        });
    }

    function getSessionString(authorId) {
        // First, check if the author already has a session with the group
        return q.ninvoke(etherpad, "listSessionsOfAuthor", { authorID: authorId })
        .then(function(sessionData) {
            var sessionIds = [];
            // console.log("found session data", sessionData);
            for(sessionId in sessionData) {
                sessionIds.push(sessionId);
            }

            return sessionIds.join(",");
        }).catch(function(err) {
            console.error("Can't retrieve session ID for author", authorId, err);
            throw err;
        });
    }

    etherpad = etherpadApi.connect({
        apikey: config.etherpad.apiKey,
        host: config.etherpad.host,
        port: config.etherpad.port,
        rootPath: config.etherpad.rootPath
    });

    getAuthorId(req.user._id.toString(), req.user.username)
    .then(getSessionString)
    .then(function(sessionString) {
        res.cookie("sessionID", sessionString);
        res.json({
            sessionString: sessionString
        });
    }).catch(function(err) {
        console.error('Error retrieving author or session: ', err);
        utils.sendError(res, 500, err);
    });
};
