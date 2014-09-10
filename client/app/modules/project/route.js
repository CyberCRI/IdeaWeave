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
                        return Project.fetch( { accessUrl : $stateParams.pid})
                    }]
                }
            })

            .state('project.details',{
                url : '/home',
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
            .state('project.noteLab',{
                url : '/workspace',
                views : {
                    projectView: {
                        templateUrl:'modules/project/templates/notes.tpl.html',
                        controller: 'NoteLabCtrl'
                    }
                },
                resolve:{
                    notes:['NoteLab','$stateParams',function(NoteLab,$stateParams){
                        return NoteLab.fetch({projectUrl: $stateParams.pid})
                    }]
                }
            })
            .state('project.noteLab.details',{
                url : '/:tid',
                views : {
                    topicView: {
                        templateUrl:'modules/noteLab/templates/notedetails.tpl.html',
                        controller: 'NoteLabDetailsCtrl'
                    }
                }
            })
            .state('project.noteLab.details.discussion',{
                url : '/discussion',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/noteLab/templates/discussion.tpl.html'
                    }
                }
            })
            .state('project.noteLab.details.resources',{
                url : '/resources',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/noteLab/templates/resources.tpl.html'
                    }
                }
            })
    }]);