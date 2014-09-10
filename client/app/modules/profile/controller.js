angular.module('cri.user',[])
    .controller('ProfileActivityCtrl',['$scope','loggedUser','users',function($scope,loggedUser,users){
        users.getActivity(loggedUser.profile.id).then(function(data){
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

    .controller('ProfileCtrl',['$scope','Notification','profile','users','recommandations','$state','$sce','activities','$materialSidenav',function ($scope,Notification,profile,users,recommandations,$state,$sce,activities,$materialSidenav) {
        $scope.profile = profile.data;
        $scope.moreData = profile.moreData
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
        $scope.recommandation = recommandations
//        $scope.activities = activities;

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
            users.follow($scope.currentUser._id,$scope.profile._id).then(function(result){
                $scope.isFollowing=true;
                $scope.profile.followers.push($scope.currentUser._id);
                Notification.display('you now follow '+$scope.profile.username)
            }).catch(function(err){
                Notification.display(err.message);
            })
        };
        $scope.unfollow = function(){
            users.unfollow($scope.currentUser._id,$scope.profile._id).then(function(result){
                Notification.display('you don\'t follow '+$scope.profile.username+' anymore');

                $scope.profile.followers.splice($scope.profile.followers.indexOf($scope.currentUser._id));
                $scope.isFollowing=false;
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
    }])

    .controller('settingBasicCtrl',['$scope','users','Gmap','Notification','$materialDialog',function ($scope,users,Gmap,Notification,$materialDialog) {
        $scope.profile=angular.copy($scope.currentUser);
        delete $scope.profile._id;
        delete $scope.profile.poster;
        if(!$scope.profile.tags){
            $scope.profile.tags=[];
        }

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            })
        };

        $scope.cropPosterModal = function($event){
            $materialDialog({
                templateUrl : 'modules/profile/templates/modal/cropPosterModal.tpl.html',
                clickOutsideToClose : false,
                escapeToClose : false,
                locals : {
                    currentUser : $scope.currentUser
                },
                controller : ['$scope','users','$hideDialog','currentUser',function($scope,users,$hideDialog,currentUser){
                    $scope.imageCropResult = null;
                    $scope.$watch('imageCropResult',function(dataUri){
                        if(dataUri){
                            var user = {
                                poster : dataUri
                            };
                            users.update(currentUser._id,user).then(function(data){
                                Notification.display('Updated successfully');
                            }).catch(function(err){
                                Notification.display(err.message);
                            }).finally(function(){
                                $hideDialog();
                            });
                        }
                    });
                    $scope.cancel = function(){
                        $hideDialog();
                    }
                }]
            });
        };

        $scope.editPageModal = function(){
            $materialDialog({
                templateUrl : 'modules/profile/templates/modal/editPageModal.tpl.html',
                locals : {
                    currentUser : $scope.currentUser
                },
                controller : ['$scope','Config','users','$hideDialog','currentUser',function($scope,Config,users,$hideDialog,currentUser){
                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.cancel = function(){
                        $hideDialog();
                    };
                    $scope.updateProfile=function(user){
                        users.update(currentUser._id,user).then(function(data){
                            Notification.display('Updated successfully');
                        }).catch(function(err){
                            Notification.display(err.message);
                        }).finally(function(){
                            $hideDialog();
                        })
                    };
                }]
            });
        };

        $scope.resetPassModal = function(){
            $materialDialog({
                templateUrl : 'modules/profile/templates/modal/resetPassword.tpl.html',
                locals : {
                    currentUser : $scope.currentUser
                },
                controller : ['$scope','users','$hideDialog','currentUser',function($scope,users,$hideDialog,currentUser){
                    $scope.cancel = function(){
                        $hideDialog();
                    };

                    $scope.updatePass=function(){
                        if($scope.profile.password!=$scope.profile.password2){
                            $scope.notMatch=true;
                        }else{
                            $scope.notMatch=false;
                            users.update(currentUser._id,$scope.profile).then(function(result){
                                Notification.display('Updated successfully');
                            }).catch(function(err){
                                Notification.display(err.message);
                            })
                        }
                    };

                }]
            });
        };

        $scope.updateProfile=function(user){
            users.update($scope.currentUser._id,user).then(function(data){
                Notification.display('Updated successfully');
            }).catch(function(err){
                Notification.display(err.message);
            })
        };


    }])