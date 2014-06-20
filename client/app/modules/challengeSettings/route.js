angular.module('cri.challengeSettings')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('challengeSettings',{
                url : '/challenge/:pid/settings',
                views :{
                    mainView : {
                        templateUrl:'modules/challengeSettings/templates/challengeSettings.tpl.html',
                        controller: 'ChallengeSettingsCtrl'
                    }
                },
                resolve:{
                    challenge:['$stateParams','Challenge',function($stateParams,Challenge){
                        return Challenge.fetch({accessUrl:$stateParams.pid})
                    }]
                }
            })
            .state('challengeSettings.basic',{
                url : '/basic',
                views :{
                    settingView : {
                        templateUrl:'modules/challengeSettings/templates/basic.tpl.html',
                        controller : 'ChallengeSettingsBasicCtrl'
                    }
                }
            })
            .state('challengeSettings.poster',{
                url : '/poster',
                views :{
                    settingView : {
                        templateUrl:'modules/challengeSettings/templates/poster.tpl.html',
                        controller : 'ChallengeSettingsPosterCtrl'
                    }
                }
            })
    }]);