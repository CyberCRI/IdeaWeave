angular.module('cri.user')
    .config(['$stateProvider',function ($stateProvider) {

        $stateProvider
            .state('userSettings',{
                url : '/profile/edit/:uid',
                views : {
                    mainView : {
                        templateUrl: 'modules/user/templates/edit.tpl.html',
                        controller: 'settingBasicCtrl'
                    }
                }
            })
            .state('profile',{
                url : '/user/:uid',
                views : {
                    mainView: {
                        templateUrl: 'modules/user/templates/me.tpl.html',
                        controller: 'ProfileCtrl'
                    }
                },
                resolve : {
                    profile : ['users','$stateParams',function(users,$stateParams){
                        return users.getProfile($stateParams.uid);
                    }],
                    recommendUser : ['Recommend','loggedUser',function(Recommend,loggedUser){
                        return Recommend.fetchUser(loggedUser.profile.id);
                    }],
                    recommendProjects : ['Recommend','loggedUser',function(Recommend,loggedUser){
                        return Recommend.fetchProject(loggedUser.profile.id);
                    }],
                    recommendChallenge : ['Recommend','loggedUser',function(Recommend,loggedUser){
                        return Recommend.fetchChallenge(loggedUser.profile.id);
                    }]
                }
            })
    }]);