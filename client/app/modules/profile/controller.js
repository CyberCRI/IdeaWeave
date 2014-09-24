angular.module('cri.profile',[])
    .controller('ProfileActivityCtrl',['$scope','loggedUser','Profile',function($scope,loggedUser,Profile){
        Profile.getActivity(loggedUser.profile.id).then(function(data){
            $scope.activities = data;
        }).catch(function(err){
            console.log(err);
        });
        $scope.noPage=1;
        $scope.isEnd=false;
        $scope.loadMoreActivities=function(num){
            $scope.noPage=num+1;
            var skip=10*num;
            if(!$scope.isEnd){
                Profile.getActivity(loggedUser.profile.id,skip).then(function(result){
                    if(result.length>0){
                        for(var i=0;i<result.length;i++){
                            $scope.activities.push(result[i]);
                        }
                    }else{
                        $scope.isEnd=true;
                    }
                });
            }
        };
    }])

    .controller('ProfileCtrl',['$scope','Notification','profile','Profile','Recommendation','$state','$sce','activities','$materialSidenav','$q',function ($scope,Notification,profile,Profile,Recommendation,$state,$sce,activities,$materialSidenav,$q) {

        $scope.profile = profile.data;
        $scope.moreData = profile.moreData;
        $scope.activities = [];
        var leftNav;
        $scope.toggle = function(){
            leftNav.toggle();
        };
        $scope.$on('showProfile',function(){
            leftNav = $materialSidenav('left');
            leftNav.toggle();
        });

        angular.forEach(activities,function(activity,key){
           activity.createDate = new Date(activity.createDate).toISOString();
            $scope.activities.push(activity);
        });

        if($scope.profile.brief){
            $scope.profile.secureBrief = $sce.trustAsHtml($scope.profile.brief);
        }

        $scope.now = new Date().getTime();
//        $scope.activities = activities;

        $scope.isFollowing = false;
        if($scope.currentUser){
            if($scope.currentUser._id == $scope.profile._id){
                $scope.isOwner=true;
                $q.all([
                    Recommendation.fetchUsers($scope.currentUser._id,$scope.currentUser.tags,'user'),
                    Recommendation.fetchChallenges($scope.currentUser._id,$scope.currentUser.tags,'user'),
                    Recommendation.fetchProjects($scope.currentUser._id,$scope.currentUser.tags,'user')
                ]).then(function(recommendations){
                    console.log(recommendations)
                    if(recommendations[0].length > 0){
                        $scope.recommandedUsers = recommendations[0];
                    }
                    if(recommendations[2].length > 0){
                        $scope.recommandedProjects = recommendations[2];
                    }
                    if(recommendations[1].length > 0){
                        $scope.recommandedChallenges = recommendations[1];
                    }
                }).catch(function(err){
                    console.log('nooooooo',err);
                });
            }else{
                angular.forEach($scope.profile.followers,function(follower){
                    if(follower._id == $scope.currentUser._id){
                        $scope.isFollowing=true;
                    }
                });
            }
        }
//        $scope.d3Tags = [];
//        angular.forEach($scope.profile.tags,function(v,k){
//            $scope.d3Tags.push({
//                title : v,
//                number : 1
//            })
//        });

        // caculate profile rule
        var score=$scope.profile.score;
        var name='';
        var next='';
        if(score<49){
            name='Level 1';
            next=200;
        }else if(score<199){
            name='Level 2';
            next=500;
        }else if(score<499){
            name='Level 3';
            next=1000;
        }else if(score<999){
            name='Level 4';
            next=2000;
        }else if(score<1999){
            name='Level 5';
            next=5000;
        }else{
            name='Level 6';
            next=10000;
        }
        $scope.profile.rule=name;
        $scope.profile.next=next;
        $scope.profile.ugProgress=($scope.profile.score/next*100).toFixed(2);


        // follow user
        $scope.follow=function(){
            Profile.follow($scope.currentUser._id,$scope.profile._id).then(function(result){
                $scope.isFollowing=true;
                $scope.profile.followers.push($scope.currentUser._id);
                Notification.display('you now follow '+$scope.profile.username);
            }).catch(function(err){
                Notification.display(err.message);
            });
        };
        $scope.unfollow = function(){
            Profile.unfollow($scope.currentUser._id,$scope.profile._id).then(function(result){
                Notification.display('you don\'t follow '+$scope.profile.username+' anymore');

                $scope.profile.followers.splice($scope.profile.followers.indexOf($scope.currentUser._id));
                $scope.isFollowing=false;
            }).catch(function(err){
                Notification.display(err.message);
            });
        };
    }]);