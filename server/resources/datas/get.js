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
switch (parts[0]) {

    case 'challengebytag':
        dpd.challenges.get({tags: {$regex: tag + ".*", $options: 'i'}, context: 'feed'}, function (result, err) {
            setResult(result);
        });
        break;
    case 'profile':

    function getPidsfromOj(data) {
        var pids = [];
        if (data && data.length > 0) {
            for (var i in data) {
                pids[i] = data[i].container;
            }
        }
        return pids;
    }

    function getCProjects(uid, pids, callback) {
        var subcount = 0;
        var result = [];
        dpd.projects.get({member: {$in: [uid]}, owner: {$ne: uid}, $sort: {score: -1, createDate: -1}, context: 'list'}, function (data, err) {
            finalCallback(data, callback);
        });
        dpd.projects.get({id: {$in: pids}, owner: {$ne: uid}, context: 'list'}, function (data, err) {
            finalCallback(data, callback);
        });
        function finalCallback(data, callback) {
            subcount++;
            result = result.concat(data);
            // delete dulplicate
            result = uniqueObject(result);
            if (subcount == 2) {
                callback(result);
            }
        }
    }

    function getConProjects(uid, callback) {
        var count = 0;
        var pids = [];
        dpd.pforums.get({owner: uid}, function (data, err) {
            scallback(getPidsfromOj(data), callback);
        });
        dpd.plinks.get({owner: uid}, function (data, err) {
            scallback(getPidsfromOj(data), callback);
        })
        function scallback(data, callback) {
            count++;
            pids = pids.concat(data);
            if (count == 2) {
                getCProjects(uid, pids, callback);
            }
        }
    }

        dpd.users.get({id: parts[1]}, function (user) {
            dpd.followers.get({users: {$in: [user.id]}, type: 'users'}, function (data, err) {
                user.followings = [];
                if (data) {
                    for (var i in data) {
                        user.followings.push(data[i].eid);
                    }
                }
                dpd.followers.get({eid: user.id}, function (data) {
                    if (data) {
                        user.followers = data.users || [];
                    } else {
                        user.followers = [];
                    }
                    dpd.projects.get({owner: user.id}, function (data) {
                        if (data) {
                            user.projects = data;
                        } else {
                            user.projects = [];
                        }
                        getConProjects(user.id, function (contribP) {
                            contribP.forEach(function (project) {
                                user.projects.push(project);
                            })
                            dpd.challenges.get({ owner: user.id }, function (data) {
                                if (data) {
                                    user.challenges = data;

                                } else {
                                    user.challenges = [];
                                }
                                var carr = [];
                                for (var i in user.projects) {
                                    carr[i] = (user.projects[i].container);
                                }
                                dpd.challenges.get({id: {$in: carr}, $sort: {follow: -1}, context: 'list'}, function (datas) {
                                    datas.forEach(function (v, k) {
                                        user.challenges.push(v);
                                    });
                                    dpd.followers.get({users: {$in: [user.id]}, type: 'challenges'}, function (datas, err) {
                                        if (datas.length > 0) {
                                            var fpids = [];
                                            for (var i in datas) {
                                                fpids[i] = datas[i].eid;
                                            }
                                            dpd.challenges.get({id: {$in: fpids}, $sort: {score: -1, createDate: -1}, context: 'list'}, function (data) {
                                                data.forEach(function (v, k) {
                                                    user.challenges.push(v);
                                                });
                                            });
                                        }
                                        user.challenges = uniqueObject(user.challenges);
                                        user.projects = uniqueObject(user.projects);
                                        setResult(user);
                                    });
                                });
                            });
                        });
                    });
                });
            });

        });
        break;
    case 'activity':
        var uid = parts[1];
        var limit = parts[2];

        // get follower's activity
    function getFollowers(uid, callback) {
        dpd.followers.get({users: {$in: [uid]}, type: 'users'}, function (data) {
            callback(data)
        });
    }

    function getActivity(uid, callback) {
        getFollowers(uid, function (followings) {
            if (followings.length > 0) {
                var response = [],
                    followingCounter = 0;
                followings.forEach(function (v, k) {
                    dpd.activities.get({ owner: v.eid, context: 'list' }, function (activities, err) {
                        var activitiesCounter = 0;
                        activities.forEach(function (v, k) {
                            response.push(v)
                            activitiesCounter++;
                            if(activitiesCounter == activities.length){
                                followingCounter++;
                            }
                        });
                        if (followingCounter == followings.length) {
                            activities.sort(function (a, b) {
                                if (a.createDate > b.createDate)
                                    return -1;
                                if (a.createDate < b.createDate)
                                    return 1;
                                // a must be equal to b
                                return 0;
                            });

                            callback(response.slice(0,limit));
                        }
                    })
                });
            } else {
                callback('');
            }
        });
    }

        getActivity(uid, setResult);
        break;
    case 'conChallenges':
        var uid = parts[1];
        // get project that he created
        dpd.projects.get({owner: uid, context: ''}, function (result) {
            if (result.length > 0) {
                var carr = [];
                for (var i in result) {
                    carr[i] = (result[i].container);
                }
                dpd.challenges.get({id: {$in: carr}, $sort: {follow: -1}, context: 'list'}, function (datas) {
                    setResult(datas);
                });
            } else {
                setResult('');
            }
        });
        break;
    case 'fChallenges':
        var uid = parts[1];
        dpd.followers.get({users: {$in: [uid]}, type: 'challenges'}, function (datas, err) {
            if (datas.length > 0) {
                var fpids = [];
                for (var i in datas) {
                    fpids[i] = datas[i].eid;
                }
                dpd.challenges.get({id: {$in: fpids}, $sort: {score: -1, createDate: -1}, context: 'list'}, setResult);
            } else {
                setResult('');
            }
        });
        break;
    case 'conProjects':
        var uid = parts[1];
        // projects that i post topic or post links
    function getPidsfromOj(data) {
        var pids = [];
        if (data && data.length > 0) {
            for (var i in data) {
                pids[i] = data[i].container;
            }
        }
        return pids;
    }

    function getCProjects(uid, pids, callback) {
        var subcount = 0;
        var result = [];
        dpd.projects.get({member: {$in: [uid]}, owner: {$ne: uid}, $sort: {score: -1, createDate: -1}, context: 'list'}, function (data, err) {
            finalCallback(data, callback);
        });
        dpd.projects.get({id: {$in: pids}, owner: {$ne: uid}, context: 'list'}, function (data, err) {
            finalCallback(data, callback);
        });
        function finalCallback(data, callback) {
            subcount++;
            result = result.concat(data);
            // delete dulplicate
            result = uniqueObject(result);
            if (subcount == 2) {
                callback(result);
            }
        }
    }

    function getConProjects(uid, callback) {
        var count = 0;
        var pids = [];
        dpd.pforums.get({owner: uid}, function (data, err) {
            scallback(getPidsfromOj(data), callback);
        });
        dpd.plinks.get({owner: uid}, function (data, err) {
            scallback(getPidsfromOj(data), callback);
        })
        function scallback(data, callback) {
            count++;
            pids = pids.concat(data);
            if (count == 2) {
                getCProjects(uid, pids, callback);
            }
        }
    }

        // set result;
        getConProjects(uid, setResult);
        break;
    case 'fProjects':
        var uid = parts[1];
        // get projets that i follow
        dpd.followers.get({users: {$in: [uid]}, type: 'project'}, function (datas, err) {
            if (datas.length > 0) {
                var fpids = [];
                for (var i in datas) {
                    fpids[i] = datas[i].eid;
                }
                dpd.projects.get({id: {$in: fpids}, $sort: {score: -1, createDate: -1}, context: 'list'}, setResult);
            } else {
                setResult('');
            }
        });
        break;
    case 'searchTag':
        var tag = parts[1];
        // delete whitespace
        tag = tag.replace(/%20/g, " ");

        //get users
    function searchUsers(tag, callback) {
        //search by tag
        dpd.users.get({tags: {$regex: tag + ".*", $options: 'i'}, context: 'userBlock'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
        // search by username
        dpd.users.get({username: {$regex: tag + ".*", $options: 'i'}, context: 'userBlock'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
        // search by realname
        dpd.users.get({realname: {$regex: tag + ".*", $options: 'i'}, context: 'userBlock'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
    }

    function searchProjects(tag, callback) {
        //search by tag
        dpd.projects.get({tags: {$regex: tag + ".*", $options: 'i'}, context: 'feed'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
        // search by title
        dpd.projects.get({title: {$regex: tag + ".*", $options: 'i'}, context: 'feed'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
        // search by brief
        dpd.projects.get({brief: {$regex: tag + ".*", $options: 'i'}, context: 'feed'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
    }

    function searchChallenges(tag, callback) {
        //search by tag
        dpd.challenges.get({tags: {$regex: tag + ".*", $options: 'i'}, context: 'feed'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
        // search by title
        dpd.challenges.get({title: {$regex: tag + ".*", $options: 'i'}, context: 'feed'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
        // search by brief
        dpd.challenges.get({brief: {$regex: tag + ".*", $options: 'i'}, context: 'feed'}, function (result, err) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback();
            }
        });
    }

    function getOjByTag(tag, callback) {
        // search users with same tag
        var ucount = 0;
        var uusers = [];
        searchUsers(tag, function (datas) {
            ucount++;
            if (datas && datas.length > 0) {
                uusers = uusers.concat(datas);
            }
            if (ucount == 3) {
                uusers = uniqueObject(uusers);
                callback({users: uusers});
            }
        });
        var pcount = 0;
        var projects = [];
        searchProjects(tag, function (datas) {
            pcount++;
            if (datas && datas.length > 0) {
                projects = projects.concat(datas);
            }
            if (pcount == 3) {
                projects = uniqueObject(projects);
                callback({projects: projects});
            }
        });

        var ccount = 0;
        var challenges = [];
        searchChallenges(tag, function (datas) {
            ccount++;
            if (datas && datas.length > 0) {
                challenges = challenges.concat(datas);
            }
            if (ccount == 3) {
                challenges = uniqueObject(challenges);
                callback({challenges: challenges});
            }
        });
    };
        var count = 0;
        var result = {};
        getOjByTag(tag, function (data) {
            count++;
            if (data.users) {
                result.users = data.users;
            }
            if (data.projects) {
                result.projects = data.projects;
            }
            if (data.challenges) {
                result.challenges = data.challenges;
            }
            if (count == 3) {
                setResult(result);
            }
            ;
        });
        break;
    case 'popular':
        var response = {
            challenges: [],
            projects: []
        };
        dpd.followers.get({ type: 'challenges', $sort: { count: -1 }, $limit: 5}, function (cdata) {
            cdata.forEach(function (v, k) {
                dpd.challenges.get({ id: v.eid}, function (data) {
                    delete data.poster;
                    response.challenges.push(data);
                })
            });
            dpd.followers.get({ type: 'project', $sort: { count: -1 }, $limit: 4}, function (pdata) {
                pdata.forEach(function (v, k) {
                    dpd.projects.get({ id: v.eid }, function (data) {
                        response.projects.push(data);
                        if (response.projects.length == pdata.length) {
                            setResult(response);
                        }
                    })
                })
            })
        });
        break;
}