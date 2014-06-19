angular.module('cri.account')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('login',{
                url : '/login',
                views : {
                    mainView: {
                        templateUrl: 'modules/account/templates/login.tpl.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('register',{
                url : '/register',
                views : {
                    mainView: {
                        templateUrl: 'modules/account/templates/register.tpl.html',
                        controller: 'RegisterCtrl'
                    }
                }

            })
            .state('activate',{
                url : '/account/activate/:uid',
                views : {
                    mainView: {
                        templateUrl: 'modules/account/templates/activate.tpl.html',
                        controller: 'ActivateCtrl'
                    }
                }
            })
            .state('resetPassword',{
                url : '/resetPassword',
                views : {
                    mainView: {
                        templateUrl: 'modules/account/templates/resetPass.tpl.html',
                        controller: 'resetPassCtrl'
                    }
                }
            })
    }]);