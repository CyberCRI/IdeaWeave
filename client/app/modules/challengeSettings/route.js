angular.module('cri.challengeSettings')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('challengeSettings',{
                url : '/admin/challenge/:cid',
                views :{
                    mainView : {
                        templateUrl:'modules/challengeSettings/templates/challengeSettings.tpl.html',
                        controller: 'ChallengeSettingsCtrl'
                    }
                },
                resolve:{
                    challenge:['$stateParams','Challenge',function($stateParams,Challenge){
                        return Challenge.fetch({_id:$stateParams.cid})
                    }]
                }
            })
    }]);