angular.module('cri.project')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('projects',{
                url : '/projects',
                views : {
                    mainView: {
                        templateUrl:'modules/project/templates/projects.tpl.html',
                        controller: 'ProjectExploreCtrl'
                    }
                },
                resolve:{
                    projects:['Project',function(Project){
                        var option={$limit:6,$sort:{score:-1},context:'list'};
                        return Project.fetch(option);
                    }]
                }
            })
            .state('project',{
                url : '/project/:pid',
                views : {
                    mainView : {
                        templateUrl:'modules/project/templates/project.tpl.html',
                        controller : 'ProjectCtrl'
                    }

                },
                resolve:{
                    project:['Project','$stateParams',function(Project,$stateParams){
                        return Project.fetch({accessUrl: $stateParams.pid,context:'detail'})
                    }]
                }
            })

            .state('project.details',{
                url : '/details',
                views : {
                    projectView : {
                        templateUrl : 'modules/project/templates/project-details.tpl.html'
                    }
                }
            })
            .state('project.trello',{
                url : '/trello',
                views : {
                    projectView : {
                        templateUrl : 'modules/projectSetting/templates/trello.tpl.html'
                    }
                }
            })
            .state('projectCreation',{
                url : '/projectCreation',
                resolve : {
                    challenges : ['Challenge',function(Challenge){
                        return Challenge.fetch();
                    }]
                },
                views : {
                    mainView : {
                        templateUrl:'modules/project/templates/project-create.tpl.html',
                        controller : 'ProjectCreateCtrl'
                    }
                }
            })
            .state('project.join',{
                url : '/join/:id',
                views :{
                    projectView : {
                        templateUrl:'modules/project/templates/join-project.tpl.html',
                        controller: 'ProjectJoinCtrl'
                    }
                },
                resolve : {
                    project : ['Project', '$stateParams',function(Project, $stateParams){
                        return Project.fetch({id : $stateParams.pid});
                    }]
                }
            })
    }]);