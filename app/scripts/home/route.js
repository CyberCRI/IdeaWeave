angular.module('cri.home')
.config(function($stateProvider){
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    mainView: {
                        templateUrl: 'scripts/home/templates/home.tpl.html',
                        controller: 'HomeCtrl'
                    }
                },
                resolve : {
                    tags : function(Tag){
                        return Tag.fetch();
                    },
                    positions : function(Gmap){
                        return Gmap.getAllPositions()
                    },
                    challenges : function(Challenge){
                        return Challenge.fetch({$limit : 10})
                    }
                }
            })
    })