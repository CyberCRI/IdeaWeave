'use strict';

var mongoose = require('mongoose-q')(),
    Project = mongoose.model('Project'),
    Challenge = mongoose.model('Challenge'),
    Notification = mongoose.model('Notification'),
    Note = mongoose.model('NoteLab'),
    User = mongoose.model('User'),
    Idea = mongoose.model('Idea'),
    Tag = mongoose.model('Tag'),
    socket = require('../socket/main.socket.js'),
    emailer = require('../services/mailer.service'),
    config = require('../../config/config'),
    q = require('q'),
    _ = require('lodash');

// Returns a promise
function getUserIdsToNotify(notification) {
    return User.findOneQ({ _id: notification.owner })
    .then(function(user) {
        return toStringArray(user.followers).concat(notification.owner.toString());
    }).then(function(notificationOwnerFollowers) {
        switch(notification.entityType) {
            case "project":
                return Project.findOneQ({ _id: notification.entity })
                .then(function(project) {
                    if(notification.type == "apply") {
                        // Only the user and the project admins are interested
                        return [notification.owner.toString()].concat(project.owner.toString(), toStringArray(project.members));
                    }
                    else {
                        // Find users interested in project tags
                        return getTagFollowerIds(project.tags)
                        .then(function(tagFollowerIds) {
                            // Alert everyone who might be interested
                            return notificationOwnerFollowers.concat(project.owner.toString(), toStringArray(project.members), toStringArray(project.followers), tagFollowerIds);
                        });
                    }
                });
            case "challenge": 
                return Challenge.findOneQ({ _id: notification.entity })
                .then(function(challenge) {
                    return getTagFollowerIds(challenge.tags)
                    .then(function(tagFollowerIds) {
                        return notificationOwnerFollowers.concat(challenge.owner.toString(), toStringArray(challenge.followers), tagFollowerIds);
                    });
                });
            case "idea": 
                return Idea.findOneQ({ _id: notification.entity })
                .then(function(idea) {
                    return getTagFollowerIds(idea.tags)
                    .then(function(tagFollowerIds) {
                        return notificationOwnerFollowers.concat(idea.owner.toString(), toStringArray(idea.followers), tagFollowerIds);
                    });
                });
            case "profile": 
                return User.findOneQ({ _id: notification.entity })
                .then(function(user) {
                    return notificationOwnerFollowers.concat(user.id.toString(), toStringArray(user.followers));
                });
            case "note": 
                return Note.findOneQ({ _id: notification.entity })
                .then(function(note) {
                    var commentOwners = _.map(note.comments, function(comment) { return comment.owner.toString() });
                    return notificationOwnerFollowers.concat(note.owner.toString(), commentOwners);
                });
            default:
                console.error("Unknown notification type");
                return notificationOwnerFollowers;
        }
    });
}

function toStringArray(documentArray) {
    return _.map(documentArray, function(doc) { return doc.toString() });
}

function cleanUpUserIds(userIds) {
    return _.chain(userIds).sortBy().uniq(true).value();
}

function getTagFollowerIds(tags) {
    // Find users interested in the given tags
    return Tag.findQ({ _id: { $in: tags } }, "followers")
    .then(function(tagFollowers) {
        return  toStringArray(_.chain(tagFollowers).pluck("followers").flatten(true).value());
    });
}

function onNotificationPosted(notification) {
    // Send around to only those interested
    getUserIdsToNotify(notification)
    .then(function(userIds) {
        var cleanUserIds = cleanUpUserIds(userIds);

        // Only the join project notification should be sent to the user herself
        if(notification.entityType != "project" && notification.type != "join") {
            cleanUserIds = _.without(cleanUserIds, notification.owner.toString());
        } 

        console.log("Sending notification", notification.type, notification.entityType, "to users", cleanUserIds);
        _.forEach(cleanUserIds, function(userId) {
            sendNotification(notification, userId);
        });
    })
    .fail(function(err) {
        console.error("Cannot send notification", err);
    });
}

function sendNotification(notification, userId) {
    // If the user is connected and wants live notifications, send one
    // Otherwise send mail notifications if desired
    return User.findOneQ({ _id: userId })
    .then(function(user) {
        if(socket.isConnected(userId) && user.liveNotification) {
            console.log("Sending live notification to user", userId);
            socket.sendNotification(notification, userId);
        } else if(user.mailNotification) {
            // Record the unseen notification
            return User.findOneAndUpdateQ({ _id: userId }, { $inc: "unseenNotificationCounter" })
            .then(function() {
                return prepareEmail(notification).then(function(mailContents) {
                    if(!mailContents) return;

                    console.log("Sending mail notification to user", userId);

                    var mail = {
                        to: user.username + " <" + user.email + ">",
                        subject: "IdeaWeave: " + mailContents.title,
                        text: "Hi " + user.username + ",\n\n"
                            + mailContents.body + "\n\n" 
                            + "  " + config.clientBaseUrl + mailContents.link + "\n\n"
                            + "Your friendly IdeaWeave robot.\n\n"
                            + "---\n\n" 
                            + "You are receiving this mail because you signed up for email notifications. " 
                            + "To unsubscribe, go to your profile settings on " + config.clientBaseUrl + "/admin/myProfile " 
                            + "and deselect \"email notifications\""
                    };
                    return emailer(mail);
                });
            });
        }
    })
    .catch(function(err) {
        console.error("Error sending notification to user", userId, err);
    });
}

function prepareEmail(notification) {
    return User.findOneQ({ _id: notification.owner }).then(function(owner) {
        switch(notification.entityType) {
            case "idea":
                return Idea.findOneQ({ _id: notification.entity }).then(function(idea) {
                    switch(notification.type) {
                        case "create":
                           return { 
                                title: "New Idea from " + owner.username, 
                                body: owner.username + " just created a new idea: " + idea.title,
                                link: "/idea/" + idea._id
                            };
                        case "update":
                            return {
                                title: "Idea '" + idea.title + "' updated", 
                                body: owner.username + " just updated the idea: " + idea.title,
                                link: "/idea/" + idea._id
                            };
                        case "follow":
                            return {
                                title: "Idea '" + idea.title + "' has a new follower", 
                                body: owner.username + " just followed the idea: " + idea.title,
                                link: "/idea/" + idea._id
                            };
                    }
                });
            case "challenge":
                return Challenge.findOneQ({ _id: notification.entity }).then(function(challenge) {
                    switch(notification.type) {
                        case "create":
                           return { 
                                title: "New Challenge from " + owner.username, 
                                body: owner.username + " just created a new challenge: " + challenge.title,
                                link: "/challenge/" + challenge.accessUrl
                            };
                        case "update":
                            return {
                                title: "Challenge '" + challenge.title + "' updated", 
                                body: owner.username + " just updated the challenge: " + challenge.title,
                                link: "/challenge/" + challenge.accessUrl
                            };
                        case "follow":
                            return {
                                title: "Challenge '" + challenge.title + "' has a new follower", 
                                body: owner.username + " just followed the challenge: " + challenge.title,
                                link: "/challenge/" + challenge.accessUrl
                            };
                    }
                });
            case "project":
                return Project.findOneQ({ _id: notification.entity }).then(function(project) {
                    switch(notification.type) {
                        case "create":
                           return { 
                                title: "New Project from " + owner.username, 
                                body: owner.username + " just created a new project: " + project.title,
                                link: "/project/" + project.accessUrl + "/home"
                            };
                        case "update":
                            return {
                                title: "Project '" + project.title + "' updated", 
                                body: owner.username + " just updated the project: " + project.title,
                                link: "/project/" + project.accessUrl + "/home"
                            };
                        case "follow":
                            return {
                                title: "Project '" + project.title + "' has a new follower", 
                                body: owner.username + " just followed the project: " + project.title,
                                link: "/project/" + project.accessUrl + "/home"
                            };
                        case "uploadFile":
                            return {
                                title: "Project '" + project.title + "' has new files", 
                                body: owner.username + " just uploaded a file to the project: " + project.title,
                                link: "/project/" + project.accessUrl + "/home"
                            };
                        case "createUrl":
                            return {
                                title: "Project '" + project.title + "' has new links", 
                                body: owner.username + " just added links to the project: " + project.title,
                                link: "/project/" + project.accessUrl + "/home"
                            };
                        case "join":
                            return {
                                title: owner.username + " has joined project '" + project.title + "'", 
                                body: owner.username + " just joined the project: " + project.title,
                                link: "/project/" + project.accessUrl + "/home"
                            };
                        case "apply":
                            return {
                                title: owner.username + " would like to join your project '" + project.title + "'", 
                                body: owner.username + " has applied to join your project: " + project.title + ". You can accept or decline the application on the project admin page.",
                                link: "/project/" + project.accessUrl + "/home"
                            };
                    }
                });
            case "profile":
                return User.findOneQ({ _id: notification.entity }).then(function(profile) {
                    switch(notification.type) {
                        case "follow":
                            return {
                                title: "User '" + profile.title + "' has a new follower", 
                                body: owner.username + " just followed the user: " + profile.title,
                                link: "/profile/" + profile._id
                            };
                        case "update":
                            return {
                                title: "User '" + profile.title + "' just updated their profile", 
                                body: owner.username + " just updated their profile",
                                link: "/profile/" + profile._id
                            };
                    }
                });
            case "note":
                return Note.findOne({ _id: notification.entity }).populate("idea challenge project").execQ()
                .then(function(note) {
                    var containerType, containerName, containerLink;
                    if(note.idea) {
                        containerType = "idea";
                        containerName = note.idea.title;
                        containerLink = "/idea/" + note.idea._id;
                    } else if(note.challenge) {
                        containerType = "challenge";
                        containerName = note.challenge.title;
                        containerLink = "/challenge/" + note.challenge.accessUrl;
                    } else if(note.project) {
                        containerType = "project";
                        containerName = note.project.title;
                        containerLink = "/project/" + note.project.accessUrl + "/home";
                    } else {
                        throw new Error("Note does not have a container", note);
                    }

                   switch(notification.type) {
                        case "createNote":
                           return { 
                                title: "New Note from " + owner.username, 
                                body: owner.username + " just posted a note on the " + containerType + " " + containerName,
                                link: containerLink
                            };
                        case "updateNote":
                            return {
                                title: "Updated Note from " + owner.username, 
                                body: owner.username + " just updated a note on the " + containerType + " " + containerName,
                                link: containerLink
                            };
                        case "createComment":
                           return { 
                                title: "New Comment from " + owner.username, 
                                body: owner.username + " just commented on the " + containerType + " " + containerName,
                                link: containerLink
                            };
                        case "updateComment":
                            return {
                                title: "Updated Comment from " + owner.username, 
                                body: owner.username + " just updated a comment about the " + containerType + " " + containerName,
                                link: containerLink
                            };
                    }
                });
        }

        // No email notification should be sent
        console.log("No email notification for", notification);
        return null;
    });
}

Notification.schema.post("save", onNotificationPosted);