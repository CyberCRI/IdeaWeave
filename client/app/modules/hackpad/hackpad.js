angular.module('cri.hackpad',[])

.directive('hackpad',function ($window,$sce,$document,$http,$templateCache,Config,NoteLab,$rootScope){
        return {
            restrict : 'EA',
            scope : {
                curentUser : '=',
                projectId : '='
            },
            templateUrl : 'modules/hackpad/templates/hackpad.tpl.html',

            link : function(scope,element) {
                scope.url = $sce.trustAsResourceUrl("http://etherpad.ideaweave.io/p/123");
            }
        };
    });