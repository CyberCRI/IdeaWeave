angular.module('cri.profile')
    .config(['$stateProvider',function ($stateProvider) {

        $stateProvider
            .state('profile',{
                url : '/profile/:uid',
                views : {
                    mainView: {
                        templateUrl: 'modules/profile/templates/profile.tpl.html',
                        controller: 'ProfileCtrl'
                    }
                },
                resolve : {
                    activities : ['Profile','$stateParams','Config',function(Profile,$stateParams,Config){
                        return Profile.getActivity($stateParams.uid,Config.activityLimit);
                    }],
                    profile : ['Profile','$stateParams',function(Profile,$stateParams){
                        return Profile.getProfile($stateParams.uid);
                    }],
                    recommandations : ['Recommandations','$stateParams',function(Recommandations,$stateParams){
                       // return Recommandations.fetchUser($stateParams.uid);
                        return [];
                    }]
                }
            })
    }]);