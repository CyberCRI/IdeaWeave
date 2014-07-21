angular.module('cri.user')
    .config(['$stateProvider',function ($stateProvider) {

        $stateProvider
            .state('userSettings',{
                url : '/profile/edit/:uid',
                views : {
                    mainView : {
                        templateUrl: 'modules/user/templates/edit.tpl.html',
                        controller: 'settingBasicCtrl'
                    }
                }
            })
            .state('profile',{
                url : '/user/:uid',
                views : {
                    mainView: {
                        templateUrl: 'modules/user/templates/me.tpl.html',
                        controller: 'ProfileCtrl'
                    }
                },
                resolve : {
                    profile : ['users','$stateParams',function(users,$stateParams){
                        return users.getProfile($stateParams.uid);
                    }],
                    recommendUser : ['Recommend','loggedUser',function(Recommend,loggedUser){
                        return Recommend.fetchUser(loggedUser.profile.id);
                    }],
                    recommendProjects : ['Recommend','loggedUser',function(Recommend,loggedUser){
                        return Recommend.fetchProject(loggedUser.profile.id);
                    }],
                    recommendChallenge : ['Recommend','loggedUser',function(Recommend,loggedUser){
                        return Recommend.fetchChallenge(loggedUser.profile.id);
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

    }]);