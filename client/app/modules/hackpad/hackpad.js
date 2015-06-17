angular.module('cri.hackpad',[])

.directive('hackpad',function ($sce, $http, Config){
        return {
            restrict: 'EA',
            scope: {
                user: '=',
                projectId: '='
            },
            templateUrl: 'modules/hackpad/templates/hackpad.tpl.html',
            link: function(scope, element) {
                var containerId = scope.projectId;

                // Get pad ID from server
                $http.get(Config.apiServer+'/etherpad/embedInfo?project='+containerId)
                .success(function(data) {
                    // TODO: set up cookies
                    scope.url = $sce.trustAsResourceUrl(Config.etherpadServer+"/p/" + data.padId);
                }).error(function(data, status) {
                    console.error("Cannot access etherpad for project", scope.project, "user", scope.user);
                });
            }
        };
    });