angular.module('cri.user')
    .config(['$stateProvider',function ($stateProvider) {

        $stateProvider
            .state('userSettings',{
                url : '/user/:uid/settings',
                views : {
                    mainView : {
                        templateUrl: 'scripts/user/templates/setting.tpl.html',
                        controller: 'settingBasicCtrl'
                    }
                }
            })
            .state('userSettings.basic',{
                url : '/basic',
                views : {
                    settingView: {
                        templateUrl: 'scripts/user/templates/settings/basic.tpl.html'
                    }
                }
            })
            .state('userSettings.pass',{
                url : '/password',
                views : {
                    settingView: {
                        templateUrl: 'scripts/user/templates/settings/password.tpl.html',
                        controller: 'settingPassCtrl'
                    }
                }
            })
            .state('userSettings.avatar',{
                url : '/avatar',
                views : {
                    settingView: {
                        templateUrl: 'scripts/user/templates/settings/avatar.tpl.html',
                        controller: 'settingAvaterCtrl'
                    }
                }
            })
            .state('userSettings.notify',{
                url : '/notify',
                views : {
                    settingView: {
                        templateUrl: 'scripts/user/templates/settings/notify.tpl.html',
                        controller: 'settingAvaterCtrl'
                    }
                }
            })
            .state('profile',{
                url : '/user/:uid',
                views : {
                    mainView: {
                        templateUrl: 'scripts/user/templates/profile.tpl.html',
                        controller: 'ProfileCtrl'
                    }
                },
                resolve : {
                    profile : function(users,$stateParams){
                        var option = {
                            id : $stateParams.uid,
                            context : 'details'
                        }
                        return users.fetch(option);
                    },
                    followers : function($stateParams,users){
                        var options = {eid:$stateParams.uid,type:'users'};
                        return users.getFollower(options);
                    },
                    following : function($stateParams, users){
                        var options = {type : 'users', value : 'following', uid : $stateParams.uid}
                        return users.getFollower(options);
                    }
                }
            })
            .state('profile.activity',{
                url : '/activity',
                views : {
                    profileView: {
                        templateUrl: 'scripts/user/templates/profile/activity.tpl.html',
                        controller : 'ProfileActivityCtrl'
                    }
                },
                resolve : {
                    activity : function(users,$stateParams){
                        return users.getActivity($stateParams.uid)
                    }
                }
            })
            .state('profile.challenges',{
                url : '/challenges',
                views : {
                    profileView: {
                        templateUrl: 'scripts/user/templates/profile/challenges.tpl.html',
                        controller : 'ProfileChallengeCtrl'
                    }
                },
                resolve : {
                    contributedChallenges : function(Challenge,$stateParams){
                        return Challenge.getContributed($stateParams.uid);
                    },
                    followedChallenges : function(Challenge,$stateParams){
                        return Challenge.getFollowing($stateParams.uid)
                    },
                    recommendChallenge : function(Recommend,$stateParams){
                        return Recommend.fetchProject($stateParams.uid);
                    }
                }
            })
            .state('profile.ideas',{
                url : '/ideas',
                views : {
                    profileView: {
                        templateUrl: 'scripts/user/templates/profile/idea.tpl.html',
                        controller : 'ProfileProjectCtrl'
                    }
                },
                resolve : {
                    createdProject : function(Project,$stateParams){
                        var options = {owner:$stateParams.uid,$sort:{score:-1,createDate:-1},context:'list'};
                        return Project.fetch(options);
                    },
                    contributedProject : function(Project,$stateParams){
                        return Project.getContributed($stateParams.uid);

                    },
                    followedProject : function(Project,$stateParams){
                        return Project.getFollowing($stateParams.uid);
                    },
                    recommendProjects : function(Recommend,$stateParams){
                        return Recommend.fetchProject($stateParams.uid);
                    }
                }
            })
            .state('profile.relations',{
                url : '/relations',
                views : {
                    profileView: {
                        templateUrl: 'scripts/user/templates/profile/relation.tpl.html',
                        controller : 'ProfileRelationCtrl'
                    }
                },
                resolve : {
                    recommendUser : function(Recommend,$stateParams){
                        console.log(1,$stateParams.uid)
                        return Recommend.fetchUser($stateParams.uid);
                    },
                    recommendFriendUser : function(Recommend,$stateParams){
                        console.log(2)
                        return Recommend.fetchFriendsUser($stateParams.uid);
                    }
                }
            })
    }]);