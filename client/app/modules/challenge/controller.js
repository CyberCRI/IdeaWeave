angular.module('cri.challenge', ['ngSanitize'])
    .controller('chatCtrl',['$scope','Challenge','mySocket',function($scope,Challenge,mySocket){
//        mySocket.on('chat_'+$scope.challenge._id+'::created',function(message){
        if($scope.currentUser){
            mySocket.socket.on('chat_'+Challenge.data._id+'::newMessage',function(message){
                $scope.messages.push(message);
            });
            $scope.postMessage = function(message){
                message.container = $scope.challenge._id;
                message.owner = $scope.currentUser._id;
                message.createDate = new Date().getTime();
                mySocket.socket.emit('chat::newMessage',message);
                $scope.messages.push(message);
                $scope.message = "";
            };
        }

        Challenge.getMessage(Challenge.data._id ).then(function(messages){
            $scope.messages = messages;
        }).catch(function(err){
            console.log(err);
        });
    }])
    .controller('ChallengesCtrl',['$scope','$rootScope',function($scope,$rootScope){
        $scope.toggleLeft = function(){
            $rootScope.$broadcast('toggleLeft')
        };
    }])
    .controller('ChallengesListCtrl',['$scope','challenges','Notification','Challenge','Project','$stateParams','Config','$materialDialog',function($scope,challenges,Notification,Challenge,Project,$stateParams,Config,$materialDialog){
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
            $materialDialog({
                templateUrl : 'modules/challenge/templates/modal/listProjects.tpl.html',
                controller : ['$scope','Project','$hideDialog',function($scope,Project,$hideDialog){
                    $scope.challenge = challenge;
                    Project.getByChallenge( id ).then(function(projects){
                        console.log('projects',projects);
                        $scope.projects = projects;
                    }).catch(function(err){
                        console.log(err);
                    });

                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }]
            });
        };


        $scope.removeChallenge = function(id){
            Challenge.remove(id).then(function(){
                Notification.display('challenge removed');
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

    }])
    .controller('ChallengeSuggestCtrl', function ($scope, Challenge,$upload,$state,Notification,Gmap,Files,Config) {
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
    .controller('ChallengeCtrl', function($scope,Challenge,challenge,Notification,$state,Project,$rootScope,NoteLab) {
        $scope.challenge = challenge[0];

        // Get notes
        NoteLab.listNotes({ challenge: $scope.challenge._id }).then(function(data){
            $scope.challenge.notes = data;
            
            angular.forEach($scope.challenge.notes, function(note) {
                // Add newComment field
                note.newComment = "";
            });
        }).catch(function(err){
            Notification.display(err.message);
        });

        $scope.postComment = function(note) {
            NoteLab.createComment(note._id, note.newComment).then(function(data){
                Notification.display("Comment posted");

                // Add the new comment and clear the field
                note.comments.push(data);
                note.newComment = "";
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

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
    .controller('ChallengeSettingsCtrl',['$scope','Challenge','Notification',function($scope,Challenge,Notification){
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
    }]);