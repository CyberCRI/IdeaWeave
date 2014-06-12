angular.module('cri.common')
    .directive('projectBlock',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            template:'<div class="panel panel-default"><div class="panel-body"><h4><a ng-href="project/{{pid}}" target="_blank">{{project[pid].title}}</a></h4>'+
                '<blockquote class="muted" style="height:80px" >{{project[pid].brief}}</blockquote></div>'+
                '<div class="panel-footer"><div showtags="" entity="project[pid]"></div></div></div>',
            link : function(scope,element,attrs){
                scope.pid=scope.$eval(attrs.projectBlock);

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