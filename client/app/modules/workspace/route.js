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
                resolve: {
                    project: function(Project,$stateParams){
                        return Project.fetch({ accessUrl : $stateParams.pid });
                    }
                }
            })
            .state('workspace.hackpad',{
                url : '/hackpad',
                views : {
                    noteDetailsView: {
                        templateUrl:'modules/workspace/templates/hackpad.tpl.html',
                        controller: 'NoteHackpadCtrl'
                    }
                }
            })
            .state('workspace.resources',{
                url : '/resources',
                views : {
                    noteDetailsView: {
                        templateUrl:'modules/workspace/templates/resources.tpl.html',
                        controller: 'NoteResourcesCtrl'
                    }
                }
            })
            .state('workspace.file',{
                url : '/files',
                views : {
                    noteDetailsView: {
                        templateUrl:'modules/workspace/templates/files.tpl.html',
                        controller: 'NoteFilesCtrl'
                    }
                }
            });
    }]);