angular.module('cri.account')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('login',{
                url : '/login',
                views : {
                    mainView: {
                        templateUrl: '/scripts/account/templates/login.tpl.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('register',{
                url : '/register',
                views : {
                    mainView: {
                        templateUrl: '/scripts/account/templates/register.tpl.html',
                        controller: 'RegisterCtrl'
                    }
                }

            })
            .state('resetPassword',{
                url : '/resetPassword',
                views : {
                    mainView: {
                        templateUrl: '/scripts/account/templates/resetPass.tpl.html',
                        controller: 'resetPassCtrl'
                    }
                }
            })
    }]);