angular.module('cri.project')
    .directive('projectBlock',['$http','Config','Project',function($http,Config,Project){
        return {
            restrict:'EA',
            replace : true,
            scope : {
                projectId : '=',
                myProject : '=',
                height : '=',
                width : '='
            },
            controller : ['$scope','Project',function($scope,Project){
                if($scope.projectId){
                    Project.fetch( { _id : $scope.projectId, type : 'block' }).then(function(project){
                        $scope.project = project[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.project = $scope.myProject;
                }
            }],
            templateUrl:'modules/project/directives/projectBlock/project-block.tpl.html',
            link : function(scope,element,attrs){
                if(scope.height){
//                    element.css('height',scope.height);
                    element.find('img').attr('height' , scope.height);
                }

                if(scope.width){
//                    element.css('height',scope.height);
                    element.find('img').attr('width' , scope.width);
                }
                element.css('width',scope.width);
                element.css('height',scope.height);
                scope.hoverEnter = function($event){
                    scope.isHovered = true;
                };
                scope.hoverLeave= function($event){
                    scope.isHovered = false;
                };
                element.bind('touch',function(e){
                    scope.isHovered = !scope.block.isHovered;
                });

            }
        };
    }])
    .directive('projectInfo',[function(){
        return {
            restrict:'EA',
            scope : {
                projectId : '=',
                myProject : '='
            },
            templateUrl:'modules/project/directives/projectBlock/project-info.tpl.html',
            controller : ['$scope','Project',function($scope,Project){
                if($scope.projectId){
                    Project.fetch( { _id : $scope.projectId, type : 'info' }).then(function(project){
                        $scope.project = project[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.project = $scope.myProject;
                }
            }]
        };
    }])
.directive('projectCard',[function(){
        return {
            restrict : 'EA',
            templateUrl : 'modules/project/directives/projectBlock/project-card.tpl.html',
            // replace: true,
            scope : {
                projectId : '=',
                myProject : '=',
                currentUser : '='
            },
            controller : function($scope,Project){
                if($scope.projectId){
                    Project.fetch( { _id : $scope.projectId, type : 'card' }).then(function(project){
                        $scope.project = project[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.project = $scope.myProject;
                }

                $scope.isAdmin = function() {
                    if(!$scope.project || !$scope.currentUser) return false;

                    return $scope.project.owner == $scope.currentUser._id || _.contains($scope.project.members, $scope.currentUser._id);
                }; 
            }
        };
    }]);