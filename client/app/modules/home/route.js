angular.module('cri.home')
.config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('home', {
                abstract : true,
                views: {
                    mainView: {
                        templateUrl: 'modules/home/templates/home.tpl.html',
                        controller: 'HomeCtrl'
                    }
                },
                resolve : {
                    tags : ['Tag',function(Tag){
                        return Tag.fetch();
                    }],
                    positions : ['Gmap',function(Gmap){
                        return Gmap.getAllPositions()
                    }],
                    popularThings : ['$http','CONFIG',function($http,CONFIG){
                        return $http.get(CONFIG.apiServer+'/datas/popular');
                    }]
                }
            })
            .state('home.signup',{
                url : '/',
                views : {
                    loginView : {
                        templateUrl: 'modules/account/templates/register.tpl.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })
            .state('home.signin',{
                url : '/signin',
                views : {
                    loginView : {
                        templateUrl: 'modules/account/templates/login.tpl.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
    }])