angular.module('cri.etherpad',[])

.directive('etherpad',function ($sce, $http, $cookies, Config){
        return {
            restrict: 'EA',
            scope: {
                user: '=',
                projectId: '='
            },
            templateUrl: 'modules/etherpad/templates/etherpad.tpl.html',
            link: function(scope, element) {
                var containerId = scope.projectId;

                // Get pad ID from server
                $http.get(Config.apiServer+'/etherpad/embedInfo?project='+containerId)
                .then(function(padData) {
                    // Set up cookies
                    return $http.get(Config.apiServer+'/etherpad/session')
                    .then(function(sessionData) {
                        $cookies.sessionID = sessionData.data.sessionString;
                        scope.url = "/etherpad/p/" + padData.data.padId;
                    });
                }).catch(function(data) {
                    console.error("Cannot access etherpad for project", scope.project, "user", scope.user);
                });
            }
        };
    });