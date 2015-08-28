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
                        return Project.fetch({ accessUrl : decodeURIComponent($stateParams.pid) });
                    }
                }
            });
    }]);