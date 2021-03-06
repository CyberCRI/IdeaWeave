angular.module('cri.idea')
.directive('ideaCard', function ($http,Config,Idea) {
    return {
        restrict:'EA',
        replace: true,
        scope: {
            ideaId: '=',
            myIdea: '=',
            height: '=',
            width: '=',
            currentUser: '='
        },
        controller: function ($scope, Idea, Notification, $rootScope, $analytics) {
            if($scope.myIdea) {
                $scope.idea = $scope.myIdea;
            } else {
                Idea.fetch($scope.ideaId).then(function(idea){
                    $scope.idea = idea;
                }).catch(function(err){
                    console.log('error',err);
                });
            }

            $scope.currentUser = $rootScope.currentUser;

            var updateIdea = function() {
                if(!$scope.idea) return;

                $scope.idea.brief = cutText($scope.idea.brief, 90);
                $scope.isFollow = $scope.currentUser ?  _.chain($scope.idea.followers).pluck("_id").contains($scope.currentUser._id).value() : false;
                $scope.isLike = $scope.currentUser ?  _.contains($scope.idea.likerIds,$scope.currentUser._id) : false;
            };

            $scope.$watch('idea',updateIdea);

            var cutText = function(text,maxSize) {
                if(text.length > maxSize){
                    res = text.substring(0,maxSize) + '...';
                    return res;
                }
                else{
                    return text;
                }
            };

            $scope.follow=function(){
                if($scope.isFollow){
                    Idea.unfollow($scope.idea._id).then(function(result){
                        Notification.display('You will no longer be notified about this idea');
                        $scope.idea.followers.splice($scope.idea.followers.indexOf($scope.currentUser._id),1);
                        $scope.isFollow=false;
                        $analytics.eventTrack("unfollowIdea");
                    }).catch(function(err){
                        Notification.display(err.message);
                    });
                }else{
                    Idea.follow($scope.idea._id).then(function(result){
                        Notification.display('You will now be notified about this idea');
                        $scope.idea.followers.push($scope.currentUser._id);
                        $scope.isFollow=true;
                        $analytics.eventTrack("followIdea");
                    }).catch(function(err){
                        Notification.display(err.message);
                    });
                }
            };

            $scope.like=function(){
                if($scope.isLike){
                    Idea.dislike($scope.idea._id).then(function(result){
                        Notification.display('You no longer like this idea');
                        $scope.idea.likerIds.splice($scope.idea.likerIds.indexOf($scope.currentUser._id),1);
                        $scope.isLike=false;
                        $analytics.eventTrack("dislikeIdea");
                    }).catch(function(err){
                        Notification.display(err.message);
                    });
                }else{
                    Idea.like($scope.idea._id).then(function(result){
                        Notification.display('You like this idea');
                        $scope.idea.likerIds.push($scope.currentUser._id);
                        $scope.isLike=true;
                        $analytics.eventTrack("likeIdea");
                    }).catch(function(err){
                        Notification.display(err.message);
                    });
                }
            };
        },
        templateUrl: 'modules/idea/directives/ideaCard/idea-card.tpl.html',
        link: function(scope,element,attrs){
            element.bind('mouseenter',function(e){
                scope.isHovered = true;
            });
            element.bind('mouseleave',function(e){
                scope.isHovered = false;
            });
        }
    };
});
