angular.module('cri.common')
    .directive('projectBlock',['$http','CONFIG','Project',function($http,CONFIG,Project){
        return {
            restrict:'EA',
            scope : {
                projectId : '=',
                project : '='
            },
            templateUrl:'modules/common/directives/projectBlock/project-block.tpl.html',
            link : function(scope,element,attrs){
                console.log('project',scope.project)
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
                if(scope.projectId){
                    Project.fetch(null, scope.projectId).then(function(project){
                        scope.project = project;
                    }).catch(function(err){

                    })
                }
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
    }])
.directive('topicInfo',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict : 'EA',
            replace : true,
            template : '<span>{{ topic.title }}</span>',
            scope : {
                topicId : '='
            },
            link : function(scope,element,attrs){
                console.log(scope.topicId);
                $http.get(CONFIG.apiServer+"/pforums/"+scope.topicId).success(function(data){
                    scope.topic = data;
                    console.log(scope.topic)
                }).error(function(err){
                    console.log(err,err)
                })
            }
        }
    }]);