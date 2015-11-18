angular.module('cri.challenge')
    .directive('challengeBlock',[function(){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                myChallenge : '=',
                height : '=',
                width : '='
            },
            templateUrl:'modules/challenge/directives/challengeBlock/challenge-block.tpl.html',
            controller : ['$scope','Challenge',function($scope,Challenge){

                if($scope.challengeId){
                    Challenge.fetch( { id : $scope.challengeId, type : 'block' }).then(function(challenge){
                        $scope.challenge = challenge[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.challenge = $scope.myChallenge;
                }
            }],
            link : function(scope,element,attrs){
                if(scope.height){
                    element.find('img').attr('height' , scope.height);
                }

                if(scope.width){
                    element.find('img').attr('width' , scope.width);
                }


                scope.block = {
                    isHovered : false
                };
                scope.hoverEnter = function($event){
                    scope.block.isHovered = true;
                    scope.blockHeight =  element.find('div').height()+'px';
                };
                scope.hoverLeave= function($event){
                    scope.block.isHovered = false;
                };
                element.bind('touch',function(e){
                    scope.block.isHovered = !scope.block.isHovered;
                });


            }
        };
    }])
    .directive('challengeInfo',[function(){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                myChallenge : '='
            },
            templateUrl:'modules/challenge/directives/challengeBlock/challenge-info.tpl.html',
            controller : ['$scope','Challenge',function($scope,Challenge){
                if($scope.challengeId){
                    Challenge.fetch( { _id : $scope.challengeId, type : 'info' }).then(function(challenge){
                        $scope.challenge = challenge[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.challenge = $scope.myChallenge;
                }
            }],
            link : function(scope,element,attrs){

            }
        };
    }])
    .directive('challengeMoreCard', function() {
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                myChallenge : '=',
                currentUser: '='
            },
            templateUrl:'modules/challenge/directives/challengeBlock/challenge-more-card.tpl.html',
            controller : ['$scope','Challenge','Notification','$rootScope','$analytics',function($scope,Challenge,Notification,$rootScope,$analytics){
                if($scope.challengeId){
                    Challenge.fetch( { _id : $scope.challengeId, type : 'card' }).then(function(challenge){
                        $scope.challenge = challenge[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.challenge = $scope.myChallenge;
                }

                var updateChallenge = function() {
                    $scope.isFollow = $scope.currentUser ?  _.chain($scope.challenge.followers).pluck("_id").contains($scope.currentUser._id).value() : false;
                    $scope.isLike = $scope.currentUser ?  _.contains($scope.challenge.likers,$scope.currentUser._id) : false;
                };

                $scope.$watch('challenge',updateChallenge);

                $scope.follow=function(){
                    console.log("follow");
                    var param;
                    if($scope.isFollow){
                        param = {
                            follower : $scope.currentUser._id,
                            following : $scope.challenge._id
                        };
                        Challenge.unfollow(param).then(function(result){
                            Notification.display('You will no longer be notified about this challenge');
                            $scope.challenge.followers.splice($scope.challenge.followers.indexOf($scope.currentUser._id),1);
                            $scope.isFollow=false;
                            $analytics.eventTrack("unfollowChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }else{
                        param = {
                            follower : $scope.currentUser._id,
                            following : $scope.challenge._id
                        };
                        Challenge.follow(param).then(function(result){
                            Notification.display('You will now be notified about this challenge');
                            $scope.challenge.followers.push($scope.currentUser._id);
                            $scope.isFollow=true;
                            $analytics.eventTrack("followChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }
                };

                $scope.like=function(){
                    console.log("like");
                    console.log($scope.isLike);
                    if($scope.isLike){
                        Challenge.dislike($scope.challenge._id).then(function(result){
                            Notification.display('You no longer like this challenge');
                            $scope.challenge.likers.splice($scope.challenge.likers.indexOf($scope.currentUser._id),1);
                            $scope.isLike=false;
                            $analytics.eventTrack("dislikeChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }else{
                        Challenge.like($scope.challenge._id).then(function(result){
                            Notification.display('You like this challenge');
                            $scope.challenge.likers.push($scope.currentUser._id);
                            $scope.isLike=true;
                            $analytics.eventTrack("likeChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }
                };

                $scope.isAdmin = function() {
                    if(!$scope.challenge || !$scope.currentUser) return false;

                    return $scope.challenge.owner == $scope.currentUser._id;
                };
            }]
        };
    })
    .directive('challengeCard',[function(){
        return {
            restrict:'EA',
            scope : {
                challengeId : '=',
                myChallenge : '=',
                admin : '='

            },
            templateUrl:'modules/challenge/directives/challengeBlock/challenge-card.tpl.html',
            controller : ['$scope','Challenge','Notification','$rootScope','$analytics',function($scope,Challenge,Notification,$rootScope,$analytics){
                if($scope.challengeId){
                    Challenge.fetch( { _id : $scope.challengeId, type : 'card' }).then(function(challenge){
                        $scope.challenge = challenge[0];
                    }).catch(function(err){
                        console.log('error',err);
                    });
                }else{
                    $scope.challenge = $scope.myChallenge;
                }

                var updateChallenge = function() {
                    $scope.isFollow = $scope.currentUser ?  _.chain($scope.challenge.followers).pluck("_id").contains($scope.currentUser._id).value() : false;
                    $scope.isLike = $scope.currentUser ?  _.contains($scope.challenge.likers,$scope.currentUser._id) : false;
                };

                $scope.$watch('challenge',updateChallenge);

                $scope.follow=function(){
                    console.log("follow");
                    var param;
                    if($scope.isFollow){
                        param = {
                            follower : $scope.currentUser._id,
                            following : $scope.challenge._id
                        };
                        Challenge.unfollow(param).then(function(result){
                            Notification.display('You will no longer be notified about this challenge');
                            $scope.challenge.followers.splice($scope.challenge.followers.indexOf($scope.currentUser._id),1);
                            $scope.isFollow=false;
                            $analytics.eventTrack("unfollowChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }else{
                        param = {
                            follower : $scope.currentUser._id,
                            following : $scope.challenge._id
                        };
                        Challenge.follow(param).then(function(result){
                            Notification.display('You will now be notified about this challenge');
                            $scope.challenge.followers.push($scope.currentUser._id);
                            $scope.isFollow=true;
                            $analytics.eventTrack("followChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }
                };

                $scope.like=function(){
                    console.log("like");
                    console.log($scope.isLike);
                    if($scope.isLike){
                        Challenge.dislike($scope.challenge._id).then(function(result){
                            Notification.display('You no longer like this challenge');
                            $scope.challenge.likers.splice($scope.challenge.likers.indexOf($scope.currentUser._id),1);
                            $scope.isLike=false;
                            $analytics.eventTrack("dislikeChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }else{
                        Challenge.like($scope.challenge._id).then(function(result){
                            Notification.display('You like this challenge');
                            $scope.challenge.likers.push($scope.currentUser._id);
                            $scope.isLike=true;
                            $analytics.eventTrack("likeChallenge");
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    }
                };
            }],
            link : function(scope,element,attrs){
                element.bind('mouseenter',function(e){
                    scope.isHovered = true;
                });
                element.bind('mouseleave',function(e){
                    scope.isHovered = false;
                });
            }
        };
    }]);