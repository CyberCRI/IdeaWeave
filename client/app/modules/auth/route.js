angular.module('cri.auth')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
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
            })
            .state('terms',{
                url : '/auth/terms',
                views : {
                    mainView: {
                        templateUrl: 'modules/auth/templates/terms.tpl.html',
                        controller: 'termsCtrl'
                    }
                }
            })
            .state('forgotPassword',{
                url : '/auth/forgotPassword',
                views : {
                    mainView: {
                        templateUrl: 'modules/auth/templates/forgotPassword.tpl.html',
                        controller: 'ForgotPasswordCtrl'
                    }
                }
            })
            .state('resetPassword',{
                url : '/auth/resetPassword?email&token',
                views : {
                    mainView: {
                        templateUrl: 'modules/auth/templates/resetPassword.tpl.html',
                        controller: 'ResetPasswordCtrl'
                    }
                }
            });
    }]);