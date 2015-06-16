var etherpadApi = require('etherpad-lite-client')
    config = require('../../config/config'),
    q = require('q');

exports.getPadInfo = function(req,res) {
    var groupName;
    if(req.query.project){
        groupName = "project-" + req.query.project;
    } else if(req.query.challenge) {
        groupName = "challenge-" + req.query.challenge;
    } else if(req.query.idea) {
        groupName = "idea-" + req.query.idea;
    } else {
        return res.json(403, "Please specify a project, challenge, or idea");
    }

    etherpad = etherpadApi.connect({
        apikey: config.etherpad.apiKey,
        host: config.etherpad.host,
        port: config.etherpad.port
    });

    // Start by getting the etherpad ID of the group
    q.fcall(etherpad.createGroupIfNotExistsFor, { groupMapper: groupName })
    // Next, check if the group already has a pad
    .then(function(groupData) {
        return q.fcall(etherpad.listPads, { groupID: groupData.groupID })
            .then(function(groupPads) {
                if(groupPads.padIDs.length > 0) {
                    // Pad already exists, use it
                    return { groupId: groupData.groupID, padId: groupPads.padIDs[0] };
                } else {
                    // Pad doesn't exist, create it
                    return q.fcall(etherpad.createGroupPad, { groupID: groupData.groupID, padName: "pad"})
                    // and now get the name 
                        .then(q.fcall(etherpad.listPads, { groupID: groupData.groupID }))
                        .then(function(groupPads) {
                           return { groupId: groupData.groupID, padId: groupPads.padIDs[0] };
                        });
                }
            });
    }).then(function(groupPadInfo) {
        res.json(groupPadInfo);
    }).catch(function(err) {
        console.error('Error creating or finding group pad: ' + err.message);
        res.json(500, err);
    });

    // TODO: create author and sessions
};
