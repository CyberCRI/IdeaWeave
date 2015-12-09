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
            controller : function($scope,Project,Notification,$rootScope,$analytics){
                if($scope.projectId){
                    Project.fetch( { _id : $scope.projectId, type : 'card' }).then(function(project){
                        $scope.project = project[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.project = $scope.myProject;
                }

                var updateProject = function() {
                    $scope.isFollow = $scope.currentUser ?  _.chain($scope.project.followers).pluck("_id").contains($scope.currentUser._id).value() : false;
                    $scope.isLike = $scope.currentUser ?  _.contains($scope.project.likers,$scope.currentUser._id) : false;
                };

                $scope.$watch('project',updateProject);

                $scope.isAdmin = function() {
                    if(!$scope.project || !$scope.currentUser) return false;

                    return $scope.project.owner == $scope.currentUser._id || _.contains($scope.project.members, $scope.currentUser._id);
                }; 
                $scope.follow=function(){
                    var param;
                    if($scope.isFollow){
                        param = {
                            follower : $scope.currentUser._id,
                            following : $scope.project._id
                        };
                        Project.unfollow(param).then(function(result){
                            Notification.display('You will no longer be notified about this project');
                            $scope.project.followers.splice($scope.project.followers.indexOf($scope.currentUser._id),1);
                            $scope.isFollow=false;
                            $analytics.eventTrack("unfollowProject");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }else{
                        param = {
                            follower : $scope.currentUser._id,
                            following : $scope.project._id
                        };
                        Project.follow(param).then(function(result){
                            Notification.display('You will now be notified about this project');
                            $scope.project.followers.push($scope.currentUser._id);
                            $scope.isFollow=true;
                            $analytics.eventTrack("followProject");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }
                };

                $scope.like=function(){
                    if($scope.isLike){
                        Project.dislike($scope.project._id).then(function(result){
                            Notification.display('You no longer like this project');
                            $scope.project.likers.splice($scope.project.likers.indexOf($scope.currentUser._id),1);
                            $scope.isLike=false;
                            $analytics.eventTrack("dislikeProject");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }else{
                        Project.like($scope.project._id).then(function(result){
                            Notification.display('You like this project');
                            $scope.project.likers.push($scope.currentUser._id);
                            $scope.isLike=true;
                            $analytics.eventTrack("likeProject");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }
                };
            }
        };
    }]);