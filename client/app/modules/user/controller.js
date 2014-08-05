angular.module('cri.user',[])
    .controller('ProfileActivityCtrl',['$scope','loggedUser','users',function($scope,loggedUser,users){
        users.getActivity(loggedUser.profile.id).then(function(data){
            $scope.activities = data;
        }).catch(function(err){
            console.log(err);
        })
        $scope.noPage=1;
        $scope.isEnd=false;
        $scope.loadMoreActivities=function(num){
            $scope.noPage=num+1;
            var skip=10*num;
            if(!$scope.isEnd){
                users.getActivity(loggedUser.profile.id,skip).then(function(result){
                    if(result.length>0){
                        for(var i=0;i<result.length;i++){
                            $scope.activities.push(result[i]);
                        }
                    }else{
                        $scope.isEnd=true;
                    }
                })
            }
        };


    }])

    .controller('ProfileCtrl',['$scope','Notification','loggedUser','profile','users','$modal','recommendUser','recommendProjects','recommendChallenge','$state','$sce','activities',
        function ($scope,Notification,loggedUser, profile,users,$modal,recommendUser,recommendProjects,recommendChallenge,$state,$sce,activities) {
        $scope.user = users;
        $scope.isLogged = false;
        $scope.profile=profile;
        if($scope.profile.presentation){
            $scope.profile.securePresentation = $sce.trustAsHtml($scope.profile.presentation);
        }
        $scope.now = new Date().getTime();
        $scope.recommandation = {
            users : recommendUser,
            projects : recommendProjects,
            challenges : recommendChallenge
        };
        $scope.activities = activities;

        $scope.isFollowUser=false;
        $scope.me = loggedUser.profile;
        $scope.d3Tags = [];
        angular.forEach($scope.profile.tags,function(v,k){
            $scope.d3Tags.push({
                title : v,
                number : 1
            })
        });

        $scope.editChallengePicture = function($index,challenge) {
            if ($scope.me.id == $scope.profile.id) {
                var modalInstance = $modal.open({
                    templateUrl: 'modules/user/templates/settings/avatar.tpl.html',
                    controller: ['$scope','Challenge','Notification','$modalInstance',function($scope,Challenge,Notification,$modalInstance){
                        $scope.$on('cropReady',function(e,data){
                            Challenge.update(challenge.id,{ poster : data}).then(function(){
                                $modalInstance.close(data);
                            }).catch(function(err){
                                $modalInstance.cancel();
                            })
                        })

                    }],
                    size: 'lg',
                    windowTemplateUrl : 'modules/common/modal/modal-transparent.tpl.html',
                    backdrop : 'static'
                });

                modalInstance.result.then(function (picture) {
                    $scope.profile.challenges[$index].poster = picture;
                    Notification.display("Challenge's poster updated");
                }, function () {
                    Notification.display("error, challeng's poster is not updated");
                });
            };
        };



        $scope.editPicture = function() {
            if ($scope.me.id == $scope.profile.id) {
                var modalInstance = $modal.open({
                    templateUrl: 'modules/user/templates/settings/avatar.tpl.html',
                    controller: 'settingAvatarCtrl',
                    size: 'lg',
                    windowTemplateUrl : 'modules/common/modal/modal-transparent.tpl.html',
                    backdrop : 'static'
                });

                modalInstance.result.then(function (picture) {
                    $scope.profile.poster = picture;
                }, function () {
                });
            };
        };

        $scope.showTag = function(e){
            $state.go('tag',{title : e.text})
        }

        if(loggedUser.profile){
            $scope.isLogged = true;
            if($scope.profile.id==loggedUser.profile.id){
                $scope.isOwner=true;
            }else if($scope.profile.followers){
                if($scope.profile.followers.length>0){
                    if($scope.followers.indexOf(loggedUser.profile.id)!==-1){
                        $scope.isFollowUser=true;
                    }
                }
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
            if($scope.isFollowUser){
                users.unfollow(uid).then(function(result){
                    if(result.error){
                        Notification.display(result.error);
                    }else{
                        Notification.display('you doesn\'t follow '+$scope.profile.username+' anymore');
                        $scope.followers.splice($scope.followers.indexOf(loggedUser.profile.id),1);
                        $scope.isFollowUser=false;
                    }
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }else{
                users.follow(uid).then(function(result){
                    if(result.error){
                        Notification.display(result.error);
                    }else{
                        $scope.isFollowUser=true;
                        $scope.followers.push(loggedUser.profile.id);
                        Notification.display('you now follow '+$scope.profile.username)
                    }
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        };
    }])

    .controller('settingBasicCtrl',['$scope','users','loggedUser','Notification','CONFIG',function ($scope,users,loggedUser,Notification,CONFIG) {
        $scope.profile=loggedUser.profile;
        if(!$scope.profile.tags){
            $scope.profile.tags=[];
        }

        $scope.tinymceOption = CONFIG.tinymceOptions;

        $scope.updateProfile=function(user){
            users.update(user.id,user).then(function(data){
                Notification.display('Updated successfully');
            }).catch(function(err){
                Notification.display(err.message);
            })
        }

        $scope.updatePass=function(){
            if($scope.profile.password!=$scope.profile.password2){
                $scope.notMatch=true;
            }else{
                $scope.notMatch=false;
                users.update($scope.profile.id,$scope.profile).then(function(result){
                    Notification.display('Updated successfully');
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        }
    }])
    .controller('settingAvatarCtrl',['$scope','users','Notification','loggedUser','$modalInstance',function ($scope,users,Notification,loggedUser,$modalInstance) {
        $scope.$on('cropReady',function(e,data){
            users.update(loggedUser.profile.id,{ poster : data }).then(function(){
                loggedUser.profile.poster = data;
                $modalInstance.close(data);
            }).catch(function(err){
                Notification.display(err.message);
            })
        })

    }])
    .controller('settingNotifyCtrl',['$scope','users','Notification',function ($scope,users,Notification) {
        $scope.updateNotify=function(){
            users.update($scope.profile.id,$scope.profile).then(function(result){
                Notification.display('Updated successfully')
            }).catch(function(err){
                Notification.display(err.message)
            })
        }
    }]);
  
