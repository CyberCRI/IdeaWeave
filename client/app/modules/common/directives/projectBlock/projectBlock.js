angular.module('cri.common')
    .directive('projectBlock',['$http','CONFIG','Project',function($http,CONFIG,Project){
        return {
            restrict:'EA',
            scope : {
                projectId : '='
            },
            templateUrl:'modules/common/directives/ownerBlock/userBlock.tpl.html',
            link : function(scope,element,attrs){

                console.log(scope.projectId )
                scope.block = {
                    isHovered : false
                };
                scope.hoverEnter = function($event){
                    console.log(element.find('div').height());
                    scope.block.isHovered = true;
                    scope.blockHeight =  element.find('div').height()+'px';
                };
                scope.hoverLeave= function($event){
                    scope.block.isHovered = false;
                };
                element.bind('touch',function(e){
                    scope.block.isHovered = !scope.block.isHovered;
                });
                Project.fetch(null, scope.projectId).then(function(project){
                    console.log(challenge);
                    scope.project = project;
                }).catch(function(err){

                })
            }
        }
    }])
    .directive('projectInfo',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EA',
            replace:true,
            template:'<span>{{project[pid].title}}</span>',
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