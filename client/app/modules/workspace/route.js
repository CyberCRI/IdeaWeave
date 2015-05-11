angular.module('cri.workspace')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('workspace',{
                url : '/workspace/:pid',
                views : {
                    mainView: {
                        templateUrl:'modules/workspace/templates/notes.tpl.html',
                        controller: 'WorkspaceCtrl'
                    }
                },
                resolve:{
                    project : ['Project','$stateParams',function(Project,$stateParams){
                        return Project.fetch({ accessUrl : $stateParams.pid });
                    }]
                }
            })
            .state('workspace.note',{
                url : '/:tid',
                views : {
                    noteView: {
                        templateUrl:'modules/workspace/templates/noteMenu.tpl.html',
                        controller: 'NoteCtrl'
                    }
                }
            })
            .state('workspace.note.discussion',{
                url : '/discussion',
                views : {
                    noteDetailsView: {
                        templateUrl:'modules/workspace/templates/note.tpl.html'
                    }
                }
            })
            .state('workspace.note.hackpad',{
                url : '/hackpad',
                views : {
                    noteDetailsView: {
                        templateUrl:'modules/workspace/templates/hackpad.tpl.html',
                        controller: 'NoteHackpadCtrl'
                    }
                }
            })
            .state('workspace.note.resources',{
                url : '/resources',
                views : {
                    noteDetailsView: {
                        templateUrl:'modules/workspace/templates/resources.tpl.html',
                        controller: 'NoteResourcesCtrl'
                    }
                }
            })
            .state('workspace.note.file',{
                url : '/files',
                views : {
                    noteDetailsView: {
                        templateUrl:'modules/workspace/templates/files.tpl.html',
                        controller: 'NoteFilesCtrl'
                    }
                }
            });
    }]);