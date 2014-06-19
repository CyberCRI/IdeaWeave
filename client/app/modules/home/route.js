angular.module('cri.home')
.config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('home', {
                url: '/',
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
                    challenges : ['Challenge',function(Challenge){
                        return Challenge.fetch({$limit : 10})
                    }],
                    projects : ['Project',function(Project){
                        return Project.fetch({$limit : 10})
                    }]
                }
            })
    }])