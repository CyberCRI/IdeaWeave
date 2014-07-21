angular.module('cri.home')
.config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('home', {
                url : "/",
                views: {
                    mainView: {
                        templateUrl: 'modules/home/templates/home.tpl.html',
                        controller: 'MainCtrl'
                    }
                },
                resolve : {
                    tags : ['Tag',function(Tag){
                        return Tag.fetch();
                    }],
//                    positions : ['Gmap',function(Gmap){
//                        return Gmap.getAllPositions()
//                    }],
                    popularThings : ['$http','CONFIG',function($http,CONFIG){

                        return $http.get(CONFIG.apiServer+'/datas/popular');


                    }]
                }
            })
//            .state('home', {
//                url : "/home",
//                views: {
//                    mainView: {
//                        templateUrl: 'modules/home/templates/home.tpl.html',
//                        controller: 'HomeCtrl'
//                    }
//                },
//                resolve : {
//                    tags : ['Tag',function(Tag){
//                        return Tag.fetch();
//                    }],
////                    positions : ['Gmap',function(Gmap){
////                        return Gmap.getAllPositions()
////                    }],
//                    recommendThings : ['Recommend','loggedUser',function(Recommend,loggedUser){
//
//                        return Recommend.fetchAll(loggedUser.profile.id);
//
//
//                    }]
//                }
//            })
    }])