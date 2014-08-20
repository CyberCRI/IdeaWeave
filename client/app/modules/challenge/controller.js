angular.module('cri.challenge', [])
    .controller('chatCtrl',['$scope','Challenge','loggedUser','$window',function($scope,Challenge,loggedUser,$window){
        $window.socket.on('chat'+$scope.challenge.id+':create',function(message){
            $scope.messages.push(message);
        });

        $scope.me = loggedUser.profile;

        Challenge.getMessage($scope.challenge.id ).then(function(messages){
            console.log('messages',messages)
            $scope.messages = messages;
        }).catch(function(err){
            console.log(err)
        });

        $scope.postMessage = function(message){
            message.container = $scope.challenge.id;
            message.owner = loggedUser.profile.id;
            message.createDate = new Date().getTime();

            Challenge.postMessage(message).then(function(data){
                console.log(data);
            }).catch(function(err){
                console.log(err);
            })
        }
    }])

    .controller('ChallengesListCtrl',['$scope','challenges','Notification','Challenge','Project','loggedUser',function($scope,challenges,Notification,Challenge,Project,loggedUser){
        $scope.me = loggedUser.profile;
        $scope.challenges = challenges;
        $scope.projects = {};
        $scope.projectsToggle = {};
        $scope.noPage = 1;
        $scope.isEnd = false;
        $scope.now = new Date().getTime();
        var option = {$limit: 6, $sort: {follow: -1, createDate: -1}, context: 'list'};
        $scope.loadMoreChallenges = function (num) {
            $scope.noPage = num + 1;
            option.$skip = 6 * num;
            if (!$scope.isEnd) {

                Challenge.fetch(option).then(function (result) {
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            $scope.challenges.push(result[i]);
                        }
                    } else {
                        $scope.isEnd = true;
                        Notification.display('there is no more challenges')
                    }
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        };
        $scope.toggleProjects = function(id){
            Project.fetch({ container : id }).then(function(projects){
                console.log('projects',projects)
                $scope.projects[id] = projects;
                if(projects.length == 0){
                    $scope.message[id] = true;
                }
                $scope.projectsToggle[id] = true;
            }).catch(function(err){
                console.log(err);
            })
        };
        $scope.hideProject = function(id){
            $scope.projectsToggle[id] = false;
        };

        $scope.removeChallenge = function(id){
            Challenge.remove(id).then(function(){
                Notification.display('challenge removed')
            }).catch(function(err){
                Notification.display(err.message);
            })
        }

    }])
    .controller('ChallengeSuggestCtrl', ['$scope', 'Challenge','loggedUser','$upload','$state','Notification','Gmap','Files','CONFIG','datepickerPopupConfig', function ($scope, Challenge, loggedUser,$upload,$state,Notification,Gmap,Files,CONFIG,datepickerPopupConfig) {

        $scope.hasDuration = false;

        datepickerPopupConfig['show-button-bar'] = false;

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.openStart = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.startOpened = true;
        };

        $scope.openEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endOpened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.pform = {};
        $scope.pform.tags = [];
        $scope.tinymceOption = CONFIG.tinymceOptions;
        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            })
        };

        $scope.titleChange = function(title){
            $scope.pform.accessUrl = title.replace(/ /g,"_");
        }

        $scope.createChallenge = function (challenge) {
            challenge.owner = loggedUser.profile.id;
            challenge.startDate = challenge.startDate.getTime();
            challenge.endDate = challenge.endDate.getTime();
            Challenge.create(challenge).then(function(){
                Notification.display('Your challenge has been added. would you like to add a description picture to it ?');
                $state.go('challenges');
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
    }])
.controller('ChallengeCtrl',['$scope','Challenge','challenge','loggedUser','Notification','$state','Project',function($scope,Challenge,challenge,loggedUser,Notification,$state,Project){
        $scope.me = loggedUser.profile;

        $scope.challenge = Challenge.data = challenge[0];

        var options = {container : $scope.challenge.id,$limit:8,$sort:{score:-1},context:'list'};
        Project.fetch(options).then(function(projects){
            $scope.projects = projects;
        }).catch(function(err){
            console.log(err);
        });

        if(loggedUser.profile){
            if(loggedUser.profile.id == $scope.challenge.owner){
                $scope.isOwner = true;
            }
        }

        $scope.participate = function(){
            if(loggedUser.profile){
                Project.challengeSelected = $scope.challenge;
                $state.go('projectCreation')
            }else{
                //todo go to signuo page
            }
        };

        $scope.d3Tags = [];
        angular.forEach($scope.challenge.tags,function(v,k){
            $scope.d3Tags.push({
                title : v,
                number : 1
            })
        });

        $scope.showTag = function(e){
            $state.go('tag',{title : e.text})
        };


        // follow challenge
        if (loggedUser.profile) {
            if($scope.challenge.followers){
                if ($scope.challenge.followers.indexOf(loggedUser.profile.id) !== -1) {
                    $scope.isFollow = true;
                }
            }
        }

        $scope.followChallenge = function () {
            Challenge.follow($scope.challenge.id).then(function (result) {
                if (result.error) {
                    alert(result.error)
                } else {
                    Notification.display('Concerned about the success! Cool increased by 2 points.');
                    $scope.challenge.followers.push($scope.me.id);
                    $scope.isFollow = true;
                }
            }).catch(function(err){
                Notification.display(err.message);
            })
        }

        $scope.unfollow = function () {
            Challenge.unfollow($scope.challenge.id).then(function (result) {
                if (result.error) {
                    Notification.display('an error occured sorry');
                } else {
                    Notification.display('Concerned about the success! Cool increased by 2 points.');
                    $scope.challenge.followers.splice($scope.challenge.followers.indexOf($scope.me.id), 1);
                    $scope.isFollow = false;
                }
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
    }])