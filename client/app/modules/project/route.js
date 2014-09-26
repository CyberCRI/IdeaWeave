angular.module('cri.project')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('projects',{
                url : '/projects',
                views : {
                    mainView: {
                        templateUrl:'modules/project/templates/projects.tpl.html',
                        controller: 'ProjectsCtrl'
                    }
                }
            })
            .state('projects.list',{
                url : '/:tag',
                views : {
                    projectsView : {
                        templateUrl: 'modules/project/templates/projects-list.tpl.html',
                        controller: 'ProjectsListCtrl'
                    }
                },
                resolve : {
                    projects: ['Project','$stateParams','Config', function (Project,$stateParams,Config) {
                        return Project.getByTag($stateParams.tag,{ limit : Config.paginateProject, skip : 0});
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
                        return Project.fetch( { accessUrl : $stateParams.pid});
                    }]
                }
            })

            .state('project.home',{
                url : '/home',
                views : {
                    projectView : {
                        templateUrl : 'modules/project/templates/project-home.tpl.html'
                    }
                }
            })
            .state('project.trello',{
                url : '/trello',
                views : {
                    projectView : {
                        templateUrl : 'modules/project/templates/trello.tpl.html'
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
    }]);