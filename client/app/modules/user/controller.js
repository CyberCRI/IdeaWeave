angular.module('cri.user',[])
    .controller('ProfileRecommandationCtrl',['$scope','recommendChallenge','recommendProjects','recommendUser','recommendFriendUser',function($scope,recommendChallenge,recommendProjects,recommendUser,recommendFriendUser){
        if(recommendChallenge.length>0){
            $scope.stagCs=recommendChallenge;
        }
        if(recommendProjects.length>0){
            $scope.stagPs=recommendProjects;
        }
        if(recommendUser.length>0){
            $scope.recUsers=recommendUser;
        }
        if(recommendFriendUser.length>0){
            $scope.ffollwers=recommendFriendUser;
        }
    }])
    .controller('ProfileChallengeCtrl',['$scope', 'contributedChallenges', 'followedChallenges',function($scope, contributedChallenges, followedChallenges ){
        $scope.conChallenges=contributedChallenges;
        $scope.fChallenges=followedChallenges;
    }])
    .controller('ProfileProjectCtrl',['$scope','createdProject','contributedProject','followedProject',function($scope,createdProject,contributedProject,followedProject){
        $scope.popprojects=createdProject;
        $scope.cprojects=contributedProject;
        $scope.fprojects=followedProject;
    }])
    .controller('ProfileActivityCtrl',['$scope','activity','$stateParams','users',function($scope,activity,$stateParams,users){
        console.log(activity)
        $scope.activities=activity;
        $scope.noPage=1;
        $scope.isEnd=false;
        $scope.loadMoreActivities=function(num){
            $scope.noPage=num+1;
            var skip=10*num;
            if(!$scope.isEnd){
                users.getActivity($stateParams.uid,skip).then(function(result){
                    if(result.length>0){
                        for(var i=0;i<result.length;i++){
                            $scope.activities.push(result[i]);
                        }
                    }else{
                        $scope.isEnd=true;
                    }
                })
//                jzCommon.query(apiServer+'/datas/activity/'+$stateParams.uid+'/10/'+skip)
            }
        }
    }])
    .controller('ProfileRelationCtrl',['$scope','loggedUser',function($scope,loggedUser){
        $scope.me = loggedUser.profile;
    }])
    .controller('ProfileBriefCtrl',['$scope','$sce','loggedUser',function($scope,$sce,loggedUser){
        console.log(loggedUser.profile)
        if(loggedUser.profile.brief){
            $scope.secureBrief = $sce.trustAsHtml(loggedUser.profile.brief);
        }
        if(loggedUser.profile.presentation){
            $scope.securePresentation = $sce.trustAsHtml(loggedUser.profile.presentation);
        }
    }])
    .controller('ProfileCtrl',['$scope','$stateParams','toaster','loggedUser','profile','followers','following','users','CONFIG','$state',function ($scope,$stateParams,toaster,loggedUser, profile, followers, following,users,CONFIG,$state) {
        $scope.mapOptions = CONFIG.mapOptions;

        $scope.user = users;
        $scope.isLogged = false;
        $scope.profile=profile;
        $scope.isFollowUser=false;
        $scope.d3Tags = [];
        angular.forEach($scope.profile.tags,function(v,k){
            $scope.d3Tags.push({
                title : v,
                number : 1
            })
        });
        $scope.showTag = function(e){
            $state.go('tag',{title : e.text})
        }

        if(profile.localisation){
            $scope.map = {
                center: {
                    latitude: profile.localisation.geometry.location.lat,
                    longitude: profile.localisation.geometry.location.lng
                },
                zoom: 8
            };
        }

        if(loggedUser.profile){
            $scope.isLogged = true;
            if($stateParams.uid==loggedUser.profile.id){
                $scope.isOwner=true;
            }
        }
        if(followers[0]){
            $scope.followers = followers[0].users;
        }else{
            $scope.followers = [];
        }
        if(following){
            $scope.followings = following;
        }else{
            $scope.followings = [];
        }
;
        if($scope.followers.length>0){
            console.log(followers)
            if($scope.followers.indexOf(loggedUser.profile.id)!==-1){
                console.log('follow !!!')
                $scope.isFollowUser=true;
            }
        }
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
        $scope.followUser=function(uid){
            users.follow(uid).then(function(result){
                if(result.error){
                    toaster.pop('error','error',result.error);
                }else{
                    $scope.isFollowUser=true;
                    $scope.followers.push(loggedUser.profile.id);
                    toaster.pop('success','success','you now follow '+$scope.profile.username)
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }

        //unfollow
        $scope.unfollowUser=function(uid){
            users.unfollow(uid).then(function(result){
                if(result.error){
                    toaster.pop('error','error',result.error);
                }else{
                    toaster.pop('success','success','you doesn\'t follow '+$scope.profile.username+' anymore');
                    $scope.followers.splice($scope.followers.indexOf(loggedUser.profile.id),1);
                    $scope.isFollowUser=false;
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])

    .controller('settingBasicCtrl',['$scope','users','loggedUser','toaster',function ($scope,users,loggedUser,toaster) {
        $scope.profile=loggedUser.profile;
        if(!$scope.profile.tags){
            $scope.profile.tags=[];
        }

        $scope.updateProfile=function(user){
            users.update(user.id,user).then(function(data){
                toaster.pop('success','Updated successfully');
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])
    .controller('settingPassCtrl',['$scope','users','toaster',function ($scope,users,toaster) {
        $scope.profile={};
        $scope.updatePass=function(){
            if($scope.profile.password!=$scope.profile.password2){
                $scope.notMatch=true;
            }else{
                $scope.notMatch=false;
                users.update($scope.profile.id,$scope.profile).then(function(result){
                    toaster.pop('success','success','Updated successfully');
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
                })

            }
        }
    }])
    .controller('settingAvatarCtrl',['$scope','users','toaster','loggedUser',function ($scope,users,toaster,loggedUser) {

        $scope.$watch('imageCropResult', function(newVal) {
            if (newVal) {
                users.update(loggedUser.profile.id,{ poster : newVal }).then(function(data){
                    loggedUser.profile.poster = newVal;
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
                })
            }
        });

    }])
    .controller('settingNotifyCtrl',['$scope','users','toaster',function ($scope,users,toaster) {
        $scope.updateNotify=function(){
            users.update($scope.profile.id,$scope.profile).then(function(result){
                toaster.pop('success','success','Updated successfully')
            }).catch(function(err){
                toaster.pop('error',err.status,err.message)
            })
        }
    }]);
  
