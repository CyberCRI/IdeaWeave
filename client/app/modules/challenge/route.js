angular.module('cri.challenge')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('challenges',{
                url : '/challenges',
                abstract:true,
                resolve: {
                    tags : ['Tag',function(Tag){
                        return Tag.fetch();
                    }]
                },
                views : {
                    mainView :{
                        templateUrl: 'modules/challenge/templates/challenges.tpl.html',
                        controller: 'ChallengeExploreCtrl'
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
                            return Challenge.fetch(option);

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
                abstract : true,
                views : {
                    topicView: {
                        templateUrl:'modules/challenge/templates/challenge-forum-detail.tpl.html',
                        controller: 'cTopicDetailsCtrl'
                    }
                }
            })
            .state('challenge.topic.details.discussion',{
                url : '/discussion',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/topic/templates/discussion.tpl.html'
                    }
                }
            })
            .state('challenge.topic.details.resources',{
                url : '/resources',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/topic/templates/resources.tpl.html'
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