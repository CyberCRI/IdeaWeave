angular.module('cri.challenge', [])
    .controller('chatCtrl',['$scope','Challenge','loggedUser','$window',function($scope,Challenge,loggedUser,$window){

        $window.socket.on('chat:create',function(err,data){
            console.log(err,data);
        })

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
    .controller('ChallengeExploreCtrl', ['$scope','loggedUser','tags', function ($scope, loggedUser,tags) {
        $scope.me = loggedUser.profile;
        $scope.tags = tags;

        function uniqueObject(arr) {
            var o = {}, i, j, r = [];
            for (var i = 0; i < arr.length; i++) o[arr[i]['id']] = arr[i];
            for (var j in o) r.push(o[j])
            return r;
        }

        // query search
        $scope.queryChallenge = function () {
            if ($scope.searchChallenge) {
                // search title
                var challenges = [];
                var count = 0;
                queryTag($scope.searchChallenge, function (datas) {
                    count++;
                    if(datas){
                        challenges = challenges.concat(datas);

                    }
                    if (count == 3) {
                        $scope.challenges = uniqueObject(challenges);
                    }
                });
            } else {
                toaster.pop('info','info','you need to fill the search form')
            }
        }
        function queryTag(tag, callback) {
            Challenge.fetch({title: {$regex: tag + ".*", $options: 'i'}, context: 'list'}).then(function (data) {
                if (data.length > 0) {
                    callback(data);
                } else {
                    callback();
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            });
            Challenge.fetch({brief: {$regex: tag + ".*", $options: 'i'}, context: 'list'}).then(function (data) {
                if (data.length > 0) {
                    callback(data);
                } else {
                    callback();
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            });

            Challenge.fetch({tags: {$regex: tag + ".*", $options: 'i'}, context: 'list'}).then(function (data) {
                if (data.length > 0) {
                    callback(data);
                } else {
                    callback();
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            });
        }

    }])
    .controller('ChallengesListCtrl',['$scope','challenges','toaster','Challenge','Project',function($scope,challenges,toaster,Challenge,Project){
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
                        toaster.pop('info','the end', 'there is no more challenges')
                    }
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
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
        }
        $scope.hideProject = function(id){
            $scope.projectsToggle[id] = false;
        }

    }])
    .controller('ChallengeSuggestCtrl', ['$scope', 'Challenge','loggedUser','$upload','$state','toaster','Gmap','Files','CONFIG','datepickerPopupConfig', function ($scope, Challenge, loggedUser,$upload,$state,toaster,Gmap,Files,CONFIG,datepickerPopupConfig) {

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
                toaster.pop('info','success','Your challenge has been added. would you like to add a description picture to it ?');
                $state.go('challenges');
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])
.controller('ChallengeCtrl',['$scope','Challenge','challenge','loggedUser','toaster','$state','Project',function($scope,Challenge,challenge,loggedUser,toaster,$state,Project){
        $scope.me = loggedUser;

        $scope.challenge = Challenge.data = challenge[0];

        console.log('challenge',challenge);
        var options = {container : $scope.challenge.id,$limit:8,$sort:{score:-1},context:'list'};
        Project.fetch(options).then(function(projects){
            $scope.projects = projects;
            console.log('project',projects);
        }).catch(function(err){
            console.log(err);
        });

        if(loggedUser.profile){
            if(loggedUser.profile.id == $scope.challenge.owner){
                $scope.isOwner = true;
            }
        }
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
                    toaster.pop('info','score','Concerned about the success! Cool increased by 2 points.');
                    $scope.challenge.followers.push($scope.me.id);
                    $scope.isFollow = true;
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }

        $scope.unfollow = function () {
            Challenge.unfollow($scope.challenge.id).then(function (result) {
                if (result.error) {
                    toaster.pop('error','error','an error occured sorry');
                } else {
                    toaster.pop('info','score','Concerned about the success! Cool increased by 2 points.');
                    $scope.challenge.followers.splice($scope.challenge.followers.indexOf($scope.me.id), 1);
                    $scope.isFollow = false;
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);

            })
        }

    }])

.controller('ChallengeSettingsCtrl',['$scope','Challenge','toaster',function($scope,Challenge,toaster){

        $scope.$watch('imageCropResult', function(newVal) {
            if (newVal) {
                Challenge.update($scope.challenge.id,{ poster : newVal }).then(function(){
                    toaster.pop('success','success','challenge poster updated');
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
                })
            }
        });
        $scope.updateChallenge = function(challenge){
            Challenge.update(challenge.id,challenge).then(function(data){
                toaster.pop('success','success','Challenge updated successfully');
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])