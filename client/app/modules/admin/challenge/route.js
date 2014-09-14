angular.module('cri.admin.challenge')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('challengeAdmin',{
                url : '/admin/challenge/:cid',
                views :{
                    mainView : {
                        templateUrl:'modules/admin/challenge/templates/challengeSettings.tpl.html',
                        controller: 'AdminChallengeCtrl'
                    }
                },
                resolve:{
                    challenge:['$stateParams','Challenge',function($stateParams,Challenge){
                        return Challenge.fetch({_id:$stateParams.cid})
                    }]
                }
            })
    }]);