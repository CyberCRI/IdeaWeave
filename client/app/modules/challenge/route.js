angular.module('cri.challenge')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('challengesList',{
                url : '/challenges/:tag',
                views : {
                    mainView : {
                        templateUrl: 'modules/challenge/templates/challenges-list.tpl.html',
                        controller: 'ChallengesListCtrl'
                    }
                },
                resolve : {
                    challenges: ['Challenge','$stateParams','Config', function (Challenge,$stateParams,Config) {
                        return Challenge.getByTag($stateParams.tag,{ limit : Config.paginateChallenge, skip : 0});
//                            option = {$limit: 6, $sort: {createDate: -1}, context: 'list', title : $stateParams.tag};


                    }]
                }
            })
            .state('challengeSuggest',{
                url : '/suggest_a_challenge',
                views :{
                    mainView :{
                        templateUrl: 'modules/challenge/templates/suggest.tpl.html',
                        controller: 'ChallengeSuggestCtrl'
                    }
                }
            })
            .state('challenge',{
                url : '/challenge/:cid',
                resolve: {
                    challenge:  ['$stateParams', 'Challenge',function ($stateParams, Challenge) {
                        var option = {
                            accessUrl : $stateParams.cid
                        };

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
            .state('challenge.projectCreation',{
                url : '/projectCreation',
                views : {
                    challengeView : {
                        templateUrl:'modules/project/templates/project-create.tpl.html',
                        controller : 'ProjectCreateCtrl'
                    }
                }
            });
    }]);
