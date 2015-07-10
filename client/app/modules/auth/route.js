angular.module('cri.auth')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('register',{
                url : '/register',
                views : {
                    mainView: {
                        templateUrl: 'modules/auth/templates/register.tpl.html',
                        controller: 'RegisterCtrl'
                    }
                }

            })
            .state('activate',{
                url : '/account/activate/:uid',
                views : {
                    mainView: {
                        templateUrl: 'modules/auth/templates/activate.tpl.html',
                        controller: 'ActivateCtrl'
                    }
                }
            })
            .state('signin',{
                url : '/auth/signin',
                views : {
                    mainView: {
                        templateUrl: 'modules/auth/templates/signin.tpl.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('signup',{
                url : '/auth/signup',
                views : {
                    mainView: {
                        templateUrl: 'modules/auth/templates/signup.tpl.html',
                        controller: 'RegisterCtrl'
                    }
                }
            });
    }]);