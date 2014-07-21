angular.module('cri.account')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
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
    }]);