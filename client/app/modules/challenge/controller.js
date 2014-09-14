angular.module('cri.challenge', [])
    .controller('chatCtrl',['$scope','Challenge','mySocket',function($scope,Challenge,mySocket){
//        mySocket.on('chat_'+$scope.challenge._id+'::created',function(message){
        mySocket.socket.on('chat_'+$scope.challenge._id+'::newMessage',function(message){
            $scope.messages.push(message);
        });

        Challenge.getMessage($scope.challenge._id ).then(function(messages){
            $scope.messages = messages;
        }).catch(function(err){
            console.log(err)
        });

        $scope.postMessage = function(message){
            message.container = $scope.challenge._id;
            message.owner = $scope.currentUser._id;
            message.createDate = new Date().getTime();
            mySocket.socket.emit('chat::newMessage',message);
        }
    }])
    .controller('ChallengesCtrl',['$scope','$materialSidenav','Tag',function($scope,$materialSidenav,Tag){
        var leftNav;
        $scope.$on('showTags',function(){
            leftNav = $materialSidenav('left');
            leftNav.toggle();
        });

        Tag.fetch().then(function(tags){
            $scope.tags = tags;
        }).catch(function(err){
            console.log(err);
        });

        $scope.toggle = function(){
            leftNav.toggle();
        }

    }])
    .controller('ChallengesListCtrl',['$scope','challenges','Notification','Challenge','Project','$stateParams','Config','$materialDialog',function($scope,challenges,Notification,Challenge,Project,$stateParams,Config,$materialDialog){
        $scope.challenges = challenges;


        $scope.noPage = 0;
        $scope.isEnd = false;
        $scope.now = new Date().getTime();
        var option = { limit : Config.paginateChallenge };
        $scope.loadMoreChallenges = function () {
            console.log('ee')
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
                        Notification.display('there is no more challenges')
                    }
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        };

        $scope.showProjects = function(e,id,index){
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
                    }
                }],
                event :e
            })
        };


        $scope.removeChallenge = function(id){
            Challenge.remove(id).then(function(){
                Notification.display('challenge removed')
            }).catch(function(err){
                Notification.display(err.message);
            })
        }

    }])
    .controller('ChallengeSuggestCtrl', ['$scope', 'Challenge','$upload','$state','Notification','Gmap','Files','Config', function ($scope, Challenge,$upload,$state,Notification,Gmap,Files,Config) {

        $scope.hasDuration = false;
        $scope.pform = {};
        $scope.pform.tags = [];
        $scope.tinymceOption = Config.tinymceOptions;
        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            })
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
            Challenge.create(challenge).then(function(){
                $state.go("challenges.list",{tag : 'all'});
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
    }])
.controller('ChallengeCtrl',['$scope','Challenge','challenge','Notification','$state','Project',function($scope,Challenge,challenge,Notification,$state,Project){
        $scope.challenge = challenge[0];
        if($scope.currentUser){
            if($scope.currentUser._id == $scope.challenge.owner){
                $scope.isOwner = true;

            }
            if ($scope.challenge.followers.indexOf($scope.currentUser._id) !== -1) {
                $scope.isFollow = true;

            }
        }

        $scope.participate = function(){
            if($scope.currentUser){
                Project.challengeSelected = $scope.challenge;
                $state.go('projectCreation')
            }else{
                Notification.display('Please fill the signup form');
                $state.go('home');
            }
        };

//        $scope.d3Tags = [];
//        angular.forEach($scope.challenge.tags,function(v,k){
//            $scope.d3Tags.push({
//                title : v,
//                number : 1
//            })
//        });
//
//        $scope.showTag = function(e){
//            $state.go('tag',{title : e.text})
//        };

        $scope.follow = function () {
            Challenge.follow($scope.currentUser._id,$scope.challenge._id).then(function (result) {
                Notification.display('You are now following this challenge');
                $scope.challenge.followers.push($scope.currentUser._id);
                $scope.isFollow = true;
            }).catch(function(err){
                Notification.display(err.message);
            })
        };

        $scope.unfollow = function () {
            Challenge.unfollow($scope.currentUser._id,$scope.challenge._id).then(function (result) {
                Notification.display('You are not following this challenge anymore');
                $scope.challenge.followers.splice($scope.challenge.followers.indexOf($scope.currentUser._id), 1);
                $scope.isFollow = false;

            }).catch(function(err){
                Notification.display(err.message);

            })
        }

    }])

.controller('ChallengeSettingsCtrl',['$scope','Challenge','Notification',function($scope,Challenge,Notification){

        $scope.$watch('imageCropResult', function(newVal) {
            if (newVal) {
                Challenge.update($scope.challenge.id,{ poster : newVal }).then(function(){
                    Notification.display('challenge poster updated');
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        });
        $scope.updateChallenge = function(challenge){
            Challenge.update(challenge.id,challenge).then(function(data){
                Notification.display('Challenge updated successfully');
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
    }]);