angular.module('cri.common')
    .directive('projectBlock',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            scope : {
                projectId : '=',
                showDetails : '@'
            },
            templateUrl:'modules/common/directives/projectBlock/project-block.tpl.html',
            link : function(scope,element,attrs){

                if(!scope.project){
                    scope.project={};
                }
                var url=CONFIG.apiServer+"/projects/"+scope.projectId;
                $http.get(url).success(function(data){
                    console.log(data)
                    scope.project = data;
                }).error(function(err){
                    console.log('error',err);
                })

            }
        }
    }])
    .directive('projectInfo',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            replace:true,
            template:'<a ui-sref="project({ pid :  project[pid].accessUrl})" target="_blank">{{project[pid].title}}</a>',
            link : function(scope,element,attrs){
                scope.pid=scope.$eval(attrs.projectInfo);

                if(!scope.project){
                    scope.project={};
                }
                if(!scope.project[scope.pid]){
                    var url=CONFIG.apiServer+"/projects/"+scope.pid+"?context=list";
                    $http.get(url).success(function(data){
                        scope.project[scope.pid]=data;
                    }).error(function(err){
                        console.log('error',err);
                    })
                }
            }
        }
    }]);