angular.module('cri.profile',[])
    .controller('ProfileCtrl',function ($scope,$auth,Notification,profile,Profile,Recommendation,$state,$sce,activities,$rootScope,$q,Badge) {
        $scope.profile = profile.data;
        $scope.moreData = profile.moreData;
        $scope.activities = [];

        $scope.showMore = function(){
            $rootScope.$broadcast('toggleLeft','profile',$scope.profile)
        };

        angular.forEach(activities,function(activity,key){
           activity.createDate = new Date(activity.createDate).toISOString();
            $scope.activities.push(activity);
        });

        if($scope.profile.brief){
            $scope.profile.secureBrief = $sce.trustAsHtml($scope.profile.brief);
        }

        $scope.now = new Date().getTime();

        $scope.isFollowing = false;
        if($scope.currentUser){
            if($scope.currentUser._id == $scope.profile._id){
                $scope.isOwner=true;

            }else{
                angular.forEach($scope.profile.followers,function(follower){
                    if(follower._id == $scope.currentUser._id){
                        $scope.isFollowing=true;
                    }
                });
            }
        }

        $scope.credits = [];
        Badge.listCredits({ givenToEntity: $scope.profile._id })
        .then(function(credits) {
            $scope.credits = credits;
        });

        // follow user
        $scope.follow=function(){
            if($scope.isFollowing){
                Profile.unfollow($scope.currentUser._id,$scope.profile._id).then(function(result){
                    Notification.display('You don\'t follow '+$scope.profile.username+' anymore');

                    $scope.profile.followers.splice($scope.profile.followers.indexOf($scope.currentUser._id));
                    $scope.isFollowing=false;
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }else{
                Profile.follow($scope.currentUser._id,$scope.profile._id).then(function(result){
                    $scope.isFollowing=true;
                    $scope.profile.followers.push($scope.currentUser._id);
                    Notification.display('You now follow '+$scope.profile.username);
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        };
    })
    .controller('FeedCtrl', function ($scope, Profile, notifications, $rootScope) {
        $scope.notifications = notifications;

        $scope.lastSeenNotificationDate = new Date();

        Profile.getUnseenNotificationCounter().then(function(data) {
            $scope.lastSeenNotificationDate = new Date(data.lastSeenNotificationDate);
        })
        .then(function() { 
            // Reset notification counter
            Profile.resetUnseenNotificationCounter();
            $rootScope.unseenNotificationCounter = 0;
        });
    });
