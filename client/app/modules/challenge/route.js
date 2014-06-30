angular.module('cri.challenge')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('challenges',{
                url : '/challenges',
                resolve: {
                    challenges: ['Challenge', function (Challenge) {
                        var option = {$limit: 6, $sort: {createDate: -1}, context: 'list'};
                        return Challenge.fetch(option);
                    }]
                },
                views : {
                    mainView :{
                        templateUrl: 'modules/challenge/templates/challenges-list.tpl.html',
                        controller: 'ChallengeExploreCtrl'
                    }
                }
            })
            .state('challengeSuggest',{
                url : '/challenges/suggest',
                views :{
                    mainView :{
                        templateUrl: 'modules/challenge/templates/suggest.tpl.html',
                        controller: 'ChallengeSuggestCtrl'
                    }
                }
            })
            .state('challenge',{
                url : '/challenge/:pid',
                resolve: {
                    challenge:  ['$stateParams', 'Challenge',function ($stateParams, Challenge) {
                        var option = {
                            accessUrl : $stateParams.pid
                        }
                        return Challenge.fetch(option);
                    }]
                },
                views :{
                  mainView :{
                      templateUrl: 'modules/challenge/templates/challenge.tpl.html',
                      controller : 'ChallengeCtrl'
                  }
                }
            })
            .state('challenge.topic',{
                url : '/forum',
                views : {
                    challengeView: {
                        templateUrl: 'modules/challenge/templates/challenge-forum.tpl.html',
                        controller: 'cTopicCtrl'
                    }
                }
            })
            .state('challenge.topic.details',{
                url : '/:tid',
                views : {
                    topicView: {
                        templateUrl:'modules/challenge/templates/challenge-forum-detail.tpl.html',
                        controller: 'cTopicDetailsCtrl'
                    }
                }
            })
            .state('challenge.details',{
                url : '/details',
                views : {
                    challengeView: {
                        templateUrl: 'modules/challenge/templates/challenge-detail.tpl.html',
                        controller: 'ChallengeViewCtrl'
                    }
                }
            })
            .state('challenge.list',{
                url : '/list',
                resolve:{
                    projects: ['Project','Challenge',function(Project,Challenge){
                        return Project.fetch({
                            container : Challenge.data.id,
                            $limit:6,
                            $sort:{score:-1},
                            context:'list'})
                    }]
                },
                views : {
                    challengeView: {
                        templateUrl: 'modules/challenge/templates/challenge-project-list.tpl.html',
                        controller: 'ProjectExploreCtrl'
                    }
                }
            })
            .state('challenge.followers',{
                url : '/followers',
                views : {
                    challengeView: {
                        templateUrl: 'modules/challenge/templates/challenge-followers.tpl.html',
                        controller: 'ChallengeFollowerCtrl'
                    }
                }
            })
//            .state('challenge.settings',{
//                url : '/settings',
//                views : {
//                    challengeView: {
//                        templateUrl: 'modules/challenge/templates/challenge-settings.tpl.html',
//                        controller: 'ChallengeSettingsCtrl'
//                    }
//                }
//            })
            .state('challenge.projectCreation',{
                url : '/projectCreation',
                views : {
                    challengeView : {
                        templateUrl:'modules/project/templates/project-create.tpl.html',
                        controller : 'ProjectCreateCtrl'
                    }
                }
            })
    }]);