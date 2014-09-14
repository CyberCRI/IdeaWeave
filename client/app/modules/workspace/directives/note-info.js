angular.module('cri.workspace')
.directive('noteInfo',[function(){
        return {
            restrict : 'EA',
            templateUrl : 'modules/workspace/directives/note-info.tpl.html',
            scope : {
                noteId : '='
            },
            controller : ['$scope','NoteLab','Project',function($scope,NoteLab,Project){
                NoteLab.fetch({ id : $scope.noteId }).then(function(note){
                    $scope.note = note[0];
                    Project.fetch({_id : $scope.note.project, type : 'info'}).then(function (project){
                        $scope.project = project[0];
                    })
                });
            }]
        }
    }]);