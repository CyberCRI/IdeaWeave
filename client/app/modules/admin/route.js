angular.module('cri.admin')
.config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('admin',{
                url : '/admin',
                views : {
                    mainView : {
                        templateUrl : 'modules/admin/templates/admin.tpl.html',
                        controller : 'adminCtrl'
                    }
                },
                resolve : {
                    projects : ['Project',function(Project){
                        return Project.fetch();
                    }],
                    challenges : ['Challenge',function(Challenge){
                        return Challenge.fetch();
                    }]

                }
            })
            .state('adminChallenge',{
                url : '/admin/challenge/:pid',
                views : {
                    mainView : {
                        templateUrl : 'modules/admin/templates/dashboard.tpl.html',
                        controller : 'adminChallengeCtrl'
                    }
                },
                resolve : {
                    topics : ['Topics',function(Topics){

                    }],
                    project : ['Project',function(Project) {

                    }],
                    files : ['Files',function(Files){

                    }],
                    url : ['Urls',function(Urls){

                    }]
                }
            })
    }])