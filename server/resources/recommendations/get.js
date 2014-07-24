var userId = parts[1]

function uniqueObject(arr) {
    var unique = {},
        result = [];
    arr.forEach(function (item) {
        if (!unique[item.id]) {
            result.push(item);
            unique[item.id] = item;
        }
    });
    return result;
}

function shouldBeSuggested(taggedUser, followedUsers) {
    console.log('user', taggedUser.id)
    if (taggedUser.id === userId)
        return false;
    followedUsers.forEach(function (followedUser) {
        if (followedUser.eid == taggedUser.id) {
            return false;
        }
    });
    return true;
}

function getTaggedUsers(tag, followedUsers, suggestedUsers, counter) {
    dpd.users.get({tags: {$regex: tag + ".*", $options: 'i'}}, function (taggedUsers, err) {
        taggedUsers.forEach(function (taggedUser) {
            if (shouldBeSuggested(taggedUser, followedUsers))
                suggestedUsers.push(taggedUser);
        });
        counter.processedTags++;
        if (counter.processedTags === counter.tags)
            setResult(uniqueObject(suggestedUsers));
    })
}

function getTags(user) {
    return function (followedUsers) {
        console.log('following', followedUsers);
        var suggestedUsers = [];
        var counter = {
            processedTags: 0,
            tags: user.tags.length
        };
        user.tags.forEach(function (tag) {
            console.log('tag', tag);
            getTaggedUsers(tag, followedUsers, suggestedUsers, counter);
        })
    }
}

function getFollowedUsers(user) {
    dpd.followers.get({users: {$in: [userId]}, type: 'users'}, getTags(user));
}

switch (parts[0]) {
    case 'user':
        dpd.users.get({id: userId}, getFollowedUsers);
        break;
    case 'challenge':
        dpd.users.get({ id: userId}, function (user) {
            var result = [];
            if (user.tags) {
                user.tags.forEach(function (tag) {
                    dpd.challenges.get({tags: {$regex: tag + ".*", $options: 'i'}}, function (challenges, err) {
                        if (challenges) {
                            challenges.forEach(function (challenge, k) {
                                dpd.followers.get({eid: challenge.id}, function (follow, key) {
                                    if (follow[0]) {
                                        var isFollow = false
                                        follow[0].users.forEach(function (v, k) {
                                            if (v == me.id) {
                                                isFollow = true;
                                            }
                                        });
                                        if (!isFollow) {
                                            dpd.challenges.get({ id: challenge.id }, function (data) {
                                                result.push(data);
                                                if (k == challenges.length - 1) {
                                                    setResult(uniqueObject(result));
                                                }
                                            })
                                        }
                                    } else {
                                        dpd.challenges.get({ id: challenge.id }, function (data) {
                                            result.push(data);
                                            if (k == challenges.length - 1) {
                                                setResult(uniqueObject(result));
                                            }
                                        })
                                    }
                                });
                            })
                        }
                    })
                })
            }
        });
        break;
    case 'project':
        dpd.users.get({ id: userId}, function (user) {
            var result = [];
            user.tags.forEach(function (tag) {
                dpd.projects.get({tags: {$regex: tag + ".*", $options: 'i'}}, function (projects, err) {
                    if (projects) {
                        projects.forEach(function (project, k) {
                            dpd.followers.get({eid: project.id}, function (follow) {
                                if (follow[0]) {

                                    dpd.projects.get({ id: project.id }, function (data) {
                                        result.push(data);
                                        if (k == projects.length - 1) {
                                            setResult(uniqueObject(result));
                                        }
                                    })


                                } else {
                                    dpd.projects.get({ id: project.id }, function (data) {
                                        result.push(data);
                                        if (k == projects.length - 1) {
                                            setResult(uniqueObject(result));
                                        }
                                    })
                                }

                            })
                            if (k == projects.length - 1) {
                                setResult(uniqueObject(result));
                            }

                        })
                    }
                })
            })
        });
        break;
    default:

        break;
}