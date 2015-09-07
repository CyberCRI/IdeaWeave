angular.module('cri.challenge', ['ngSanitize'])
    .controller('ChallengesCtrl',function($scope,$rootScope){
        $scope.toggleLeft = function(){
            $rootScope.$broadcast('toggleLeft')
        };
    })
    .controller('ChallengesListCtrl',function($scope,challenges,Notification,Challenge,Project,$stateParams,Config,$mdDialog){
        $scope.challenges = challenges;

        $scope.noPage = 0;
        $scope.isEnd = false;
        $scope.now = new Date().getTime();
        var option = { limit : Config.paginateChallenge };
        $scope.loadMoreChallenges = function () {
            $scope.noPage++;
            option.skip = Config.paginateChallenge * $scope.noPage;
            if (!$scope.isEnd) {
                Challenge.getByTag($stateParams.tag,option).then(function (result) {
                    if (result.length > 0) {
                        angular.forEach(result,function(challenge){
                            $scope.challenges.push(challenge);
                        });
                    } else {
                        $scope.isEnd = true;
                        Notification.display('there is no more challenges');
                    }
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        };

        $scope.showProjects = function(id,index){
            var challenge = $scope.challenges[index];
            $mdDialog.show({
                templateUrl : 'modules/challenge/templates/modal/listProjects.tpl.html',
                controller : function($scope,Project){
                    $scope.challenge = challenge;
                    Project.getByChallenge( id ).then(function(projects){
                        console.log('projects',projects);
                        $scope.projects = projects;
                    }).catch(function(err){
                        console.log(err);
                    });

                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };


        $scope.removeChallenge = function(id){
            Challenge.remove(id).then(function(){
                Notification.display('challenge removed');
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

    })
    .controller('ChallengeSuggestCtrl', function ($scope, Challenge,Upload,$state,Notification,Gmap,Files,Config) {
        $scope.hasDuration = false;
        $scope.pform = {};
        $scope.pform.tags = [];
        $scope.tinymceOption = Config.tinymceOptions;
        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            });
        };
        $scope.titleChange = function(title){
            $scope.pform.accessUrl = title.replace(/ /g,"_");
        };

        $scope.createChallenge = function (challenge) {
            challenge.owner = $scope.currentUser._id;
            if($scope.hasDuration){
                challenge.startDate = challenge.startDate.getTime();
                challenge.endDate = challenge.endDate.getTime();
            }
            Challenge.create(challenge).then(function(data){
                $state.go('challenge', { cid : data.accessUrl });
            }).catch(function(err){
                Notification.display(err.message);
            });
        };
    })
    .controller('ChallengeCtrl', function($scope,Challenge,challenge,Notification,$state,Project,$rootScope,NoteLab,$mdDialog) {
        if(challenge.length == 0) {
            Notification.display('Cannot find the requested challenge');
            $state.go("home");
            return;
        }

        $scope.challenge = challenge[0];

        if($scope.currentUser){
            if($scope.currentUser._id == $scope.challenge.owner._id){
                $scope.isOwner = true;

            }
            angular.forEach($scope.challenge.followers,function(user){
                if(user._id == $scope.currentUser._id){
                    $scope.isFollow = true;
                }
            });
        };
        $scope.toggleLeft = function(){
            $rootScope.$broadcast('toggleLeft');
        };

        $scope.participate = function(){
            if($scope.currentUser){
                Project.challengeSelected = $scope.challenge;
                $state.go('projectCreation');
            }else{
                Notification.display('Please fill the signup form');
                $state.go('home');
            }
        };

        $scope.follow = function () {
            if($scope.isFollow){
                Challenge.unfollow($scope.currentUser._id,$scope.challenge._id).then(function (result) {
                    Notification.display('You are not following this challenge anymore');
                    $scope.challenge.followers.splice($scope.challenge.followers.indexOf($scope.currentUser._id), 1);
                    $scope.isFollow = false;

                }).catch(function(err){
                    Notification.display(err.message);
                });
            }else{
                Challenge.follow($scope.currentUser._id,$scope.challenge._id).then(function (result) {
                    Notification.display('You are now following this challenge');
                    $scope.challenge.followers.push($scope.currentUser._id);
                    $scope.isFollow = true;
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }

        };
    })

    // TODO: this is NOT USED. Remove it
    .controller('ChallengeSettingsCtrl',function($scope,Challenge,Notification){
        $scope.$watch('imageCropResult', function(newVal) {
            if (newVal) {
                Challenge.update($scope.challenge.id,{ poster : newVal }).then(function(){
                    Notification.display('challenge poster updated');
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        });
        $scope.updateChallenge = function(challenge){
            Challenge.update(challenge.id, updatedChallenge).then(function(data){
                Notification.display('Challenge updated successfully');
            }).catch(function(err){
                Notification.display(err.message);
            });
        };
    });
