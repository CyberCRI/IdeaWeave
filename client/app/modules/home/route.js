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
                    popularThings : ['$http','CONFIG',function($http,CONFIG){

                        return $http.get(CONFIG.apiServer+'/datas/popular');


                    }]
                }
            })
    }]);