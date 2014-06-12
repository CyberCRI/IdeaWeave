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
                        templateUrl: '/scripts/challenge/templates/challenges-list.tpl.html',
                        controller: 'ChallengeExploreCtrl'
                    }
                }
            })
            .state('challengeSuggest',{
                url : '/challenges/suggest',
                views :{
                    mainView :{
                        templateUrl: '/scripts/challenge/templates/suggest.tpl.html',
                        controller: 'ChallengeSuggestCtrl'
                    }
                }
            })
            .state('challenge',{
                url : '/challenge/:pid',
                resolve: {
                    challenge:  function ($stateParams, Challenge) {
                        console.log('Resolve');
                        var option = {
                            accessUrl : $stateParams.pid
                        }
                        return Challenge.fetch(option);
                    }
                },
                views :{
                  mainView :{
                      templateUrl: '/scripts/challenge/templates/challenge.tpl.html',
                      controller : 'ChallengeCtrl'
                  }
                }
            })
            .state('challenge.details',{
                url : '/details',
                views : {
                    challengeView: {
                        templateUrl: '/scripts/challenge/templates/challenge-detail.tpl.html',
                        controller: 'ChallengeViewCtrl'
                    }
                }
            })
            .state('challenge.list',{
                url : '/list',
                resolve:{
                    projects: function(Project,Challenge){
                        return Project.fetch({
                            container : Challenge.data.id,
                            $limit:6,
                            $sort:{score:-1},
                            context:'list'})
                    }
                },
                views : {
                    challengeView: {
                        templateUrl: '/scripts/challenge/templates/challenge-project-list.tpl.html',
                        controller: 'ProjectExploreCtrl'
                    }
                }
            })
            .state('challenge.followers',{
                url : '/followers',
                views : {
                    challengeView: {
                        templateUrl: '/scripts/challenge/templates/challenge-followers.tpl.html',
                        controller: 'ChallengeFollowerCtrl'
                    }
                }
            })
            .state('challenge.settings',{
                url : '/settings',
                views : {
                    challengeView: {
                        templateUrl: '/scripts/challenge/templates/challenge-settings.tpl.html',
                        controller: 'ChallengeSettingsCtrl'
                    }
                }
            })
            .state('challenge.projectCreation',{
                url : '/projectCreation',
                views : {
                    challengeView : {
                        templateUrl:'/scripts/project/templates/project-create.tpl.html',
                        controller : 'ProjectCreateCtrl'
                    }
                }
            })
    }]);