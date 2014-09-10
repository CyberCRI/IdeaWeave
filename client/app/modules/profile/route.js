angular.module('cri.user')
    .config(['$stateProvider',function ($stateProvider) {

        $stateProvider
            .state('userSettings',{
                url : '/profile/edit/:uid',
                views : {
                    mainView : {
                        templateUrl: 'modules/profile/templates/edit.tpl.html',
                        controller: 'settingBasicCtrl'
                    }
                }
            })
            .state('profile',{
                url : '/profile/:uid',
                views : {
                    mainView: {
                        templateUrl: 'modules/profile/templates/profile.tpl.html',
                        controller: 'ProfileCtrl'
                    }
                },
                resolve : {
                    activities : ['users','$stateParams','Config',function(users,$stateParams,Config){
                        return users.getActivity($stateParams.uid,Config.activityLimit);
                    }],
                    profile : ['users','$stateParams',function(users,$stateParams){
                        return users.getProfile($stateParams.uid);
                    }],
                    recommandations : ['Recommandations','$stateParams',function(Recommandations,$stateParams){
                       // return Recommandations.fetchUser($stateParams.uid);
                        return [];
                    }]
                }
            })
    }]);