angular.module('cri.challenge')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('challenges',{
                url : '/challenges',
                resolve: {
                    tags : ['Tag',function(Tag){
                        return Tag.fetch();
                    }]
                },
                views : {
                    mainView :{
                        templateUrl: 'modules/challenge/templates/challenges.tpl.html'
                    }
                }
            })
            .state('challenges.list',{
                url : '/:tag',
                views : {
                    challengesView : {
                        templateUrl: 'modules/challenge/templates/challenges-list.tpl.html',
                        controller: 'ChallengesListCtrl'
                    }
                },
                resolve : {
                    challenges: ['Challenge','$stateParams', function (Challenge,$stateParams) {
                        var option;
                        if($stateParams.tag == 'all'){
                            option = {$limit: 6, $sort: {createDate: -1}, context: 'list'};
                            return Challenge.fetch(null,null,option);
                        }else{
                            console.log($stateParams.tag)
                            return Challenge.fetch(null,null,{tags: {$regex: $stateParams.tag , $options: 'i'}, context: 'list'})
//                            option = {$limit: 6, $sort: {createDate: -1}, context: 'list', title : $stateParams.tag};
                        }

                    }]
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
