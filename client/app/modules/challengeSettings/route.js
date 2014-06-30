angular.module('cri.challengeSettings')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('challenge.settings',{
                url : '/settings',
                views :{
                    challengeView : {
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
            .state('challenge.settings.basic',{
                url : '/basic',
                views :{
                    settingView : {
                        templateUrl:'modules/challengeSettings/templates/basic.tpl.html',
                        controller : 'ChallengeSettingsBasicCtrl'
                    }
                }
            })
            .state('challenge.settings.poster',{
                url : '/poster',
                views :{
                    settingView : {
                        templateUrl:'modules/challengeSettings/templates/poster.tpl.html',
                        controller : 'ChallengeSettingsPosterCtrl'
                    }
                }
            })
    }]);