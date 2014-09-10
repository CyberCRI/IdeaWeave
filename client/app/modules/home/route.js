angular.module('cri.home')
.config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('home', {
                url : "/",
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
                    popularThings : ['$http','Config',function($http,Config){

                        return $http.get(Config.apiServer+'/popular');


                    }]
                }
            })
    }]);