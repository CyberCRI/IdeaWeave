angular.module('cri.user')
    .config(['$stateProvider',function ($stateProvider) {

        $stateProvider
            .state('profile.settings',{
                url : '/settings',
                abstract : true,
                views : {
                    profileView : {
                        templateUrl: 'modules/user/templates/setting.tpl.html',
                        controller: 'settingBasicCtrl'
                    }
                }
            })
            .state('profile.settings.basic',{
                url : '/basic',
                views : {
                    settingView: {
                        templateUrl: 'modules/user/templates/settings/basic.tpl.html'
                    }
                }
            })
            .state('profile.settings.avatar',{
                url : '/avatar',
                views : {
                    settingView: {
                        templateUrl: 'modules/user/templates/settings/avatar.tpl.html',
                        controller: 'settingAvatarCtrl'
                    }
                }
            })
            .state('profile.settings.notify',{
                url : '/notify',
                views : {
                    settingView: {
                        templateUrl: 'modules/user/templates/settings/notify.tpl.html',
                        controller: 'settingNotifyCtrl'
                    }
                }
            })
            .state('profile',{
                url : '/user/:uid',
                views : {
                    mainView: {
                        templateUrl: 'modules/user/templates/profile.tpl.html',
                        controller: 'ProfileCtrl'
                    }
                },
                resolve : {
                    profile : ['users','$stateParams',function(users,$stateParams){
                        var option = {
                            id : $stateParams.uid,
                            context : 'details'
                        }
                        return users.fetch(option);
                    }],
                    followers : ['$stateParams','users',function($stateParams,users){
                        var options = {eid:$stateParams.uid,type:'users'};
                        return users.getFollower(options);
                    }],
                    following : ['$stateParams', 'users',function($stateParams, users){
                        var options = { value : 'following', uid : $stateParams.uid}
                        return users.getFollowing(options);
                    }]
                }
            })
            .state('profile.activity',{
                url : '/activity',
                views : {
                    profileView: {
                        templateUrl: 'modules/user/templates/profile/activity.tpl.html',
                        controller : 'ProfileActivityCtrl'
                    }
                },
                resolve : {

                    recommendUser : ['Recommend','$stateParams',function(Recommend,$stateParams){
                        return Recommend.fetchUser($stateParams.uid);
                    }],
                    recommendFriendUser : ['Recommend','$stateParams',function(Recommend,$stateParams) {
                        return Recommend.fetchFriendsUser($stateParams.uid);
                    }],
                    recommendProjects : ['Recommend','$stateParams',function(Recommend,$stateParams){
                        return Recommend.fetchProject($stateParams.uid);
                    }],
                    recommendChallenge : ['Recommend','$stateParams',function(Recommend,$stateParams){
                        return Recommend.fetchChallenge($stateParams.uid);
                    }]
                }
            })
            .state('profile.challenges',{
                url : '/challenges',
                views : {
                    profileView: {
                        templateUrl: 'modules/user/templates/profile/challenges.tpl.html',
                        controller : 'ProfileChallengeCtrl'
                    }
                },
                resolve : {
                    contributedChallenges : ['Challenge','$stateParams',function(Challenge,$stateParams){
                        return Challenge.getContributed($stateParams.uid);
                    }],
                    followedChallenges : ['Challenge','$stateParams',function(Challenge,$stateParams){
                        return Challenge.getFollowing($stateParams.uid)
                    }]
                }
            })
            .state('profile.ideas',{
                url : '/ideas',
                views : {
                    profileView: {
                        templateUrl: 'modules/user/templates/profile/idea.tpl.html',
                        controller : 'ProfileProjectCtrl'
                    }
                },
                resolve : {
                    createdProject : ['Project','$stateParams',function(Project,$stateParams){
                        var options = {owner:$stateParams.uid,$sort:{score:-1,createDate:-1},context:'list'};
                        return Project.fetch(options);
                    }],
                    contributedProject : ['Project','$stateParams',function(Project,$stateParams){
                        return Project.getContributed($stateParams.uid);

                    }],
                    followedProject : ['Project','$stateParams',function(Project,$stateParams){
                        return Project.getFollowing($stateParams.uid);
                    }]
                }
            })
            .state('profile.relations',{
                url : '/relations',
                views : {
                    profileView: {
                        templateUrl: 'modules/user/templates/profile/relation.tpl.html',
                        controller : 'ProfileRelationCtrl'
                    }
                },
                resolve : {
                    recommendUser : ['Recommend','$stateParams',function(Recommend,$stateParams){
                        console.log(1,$stateParams.uid)
                        return Recommend.fetchUser($stateParams.uid);
                    }],
                    recommendFriendUser : ['Recommend','$stateParams',function(Recommend,$stateParams){
                        console.log(2)
                        return Recommend.fetchFriendsUser($stateParams.uid);
                    }]
                }
            })
            .state('profile.brief',{
                url : '/brief',
                views : {
                    profileView: {
                        templateUrl: 'modules/user/templates/profile/brief.tpl.html',
                        controller : 'ProfileBriefCtrl'
                    }
                }
            })
    }]);