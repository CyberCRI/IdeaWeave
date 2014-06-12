angular.module('cri.challenge', [])
    .controller('ChallengeExploreCtrl', ['$scope', 'challenges','users','Challenge','toaster', function ($scope, challenges, users, Challenge, toaster) {
        $scope.isLogged = users.isLoggedIn();
        $scope.challenges = challenges;
        $scope.noPage = 1;
        $scope.isEnd = false;

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
        }

        function uniqueObject(arr) {
            var o = {}, i, j, r = [];
            for (var i = 0; i < arr.length; i++) o[arr[i]['id']] = arr[i];
            for (var j in o) r.push(o[j])
            return r;
        }

        // query search
        $scope.queryChallenge = function () {
            console.log($scope.searchChallenge)
            if ($scope.searchChallenge) {
                // search title
                var challenges = [];
                var count = 0;
                queryTag($scope.searchChallenge, function (datas) {
                    count++;
                    console.log(count,datas)
                    if(datas){
                        challenges = challenges.concat(datas);

                    }
                    if (count == 3) {
                        $scope.challenges = uniqueObject(challenges);
                        console.log($scope.challenges)
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
    .controller('ChallengeSuggestCtrl', ['$scope', 'Challenge','loggedUser','$upload','$state','toaster','Gmap','Files', function ($scope, Challenge, loggedUser,$upload,$state,toaster,Gmap,Files) {
        $scope.pform = {};
        $scope.pform.tags = [];

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            })
        };

        $scope.titleChange = function(title){
            $scope.pform.accessUrl = title.replace(/ /g,"_");
        }

        $scope.createChallenge = function (challenge) {
            console.log('create',challenge)
            $scope.pform.owner = loggedUser.profile.id;
            Challenge.create(challenge).then(function(){
                toaster.pop('info','success','Your challenge has been added. would you like to add a description picture to it ?');
                $scope.fileUploadQuestion = true;
                $scope.ok = function(){
                    $scope.showFileUploader = true;
                    $scope.fileUploadQuestion = false;
                }
                $scope.cancel = function(){
                    $state.go('challenge.details',{ pid : Challenge.data.accessUrl });
                }
            }).catch(function(err){
                console.log(err);
                toaster.pop('error',err.status,err.message);
            })
        }

        $scope.fileSelected = function($files){
            $scope.file = $files[0];
            if(Files.isImage($scope.file)){
                Files.getDataUrl($scope.file).then(function(dataUrl){
                    $scope.fileUrl = dataUrl;
                })
                $scope.dropBoxHeight = "300px";
            }else{
                toaster.pop('warning','warning','this file is not an image');
            }
        }


        $scope.cancelUpload = function(){
            $scope.file = null;
            $scope.fileUrl = null;
            $scope.dropBoxHeight = "100px";
        }

        $scope.upload = function(topic,file,description){
            Challenge.uploadPoster(file).then(function(data){
                toaster.pop('success','upload success','your file has been uploaded !!!');
                $scope.file = null;
                $scope.fileUrl = null;
                $scope.dropBoxHeight = "100px";
                $state.go('challenge.details',{ pid : Challenge.data.accessUrl });
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])
    .controller('ChallengeViewCtrl', ['$scope', 'challenge','users', 'Challenge','Project','$sce','toaster','loggedUser',
        function ($scope, challenge,users, Challenge, Project, $sce, toaster, loggedUser) {
            $scope.user = users;
            $scope.isFollow = false;
            $scope.challenge = Challenge.data = challenge[0];
            if($scope.challenge.presentation){
                $scope.challenge.presentationDisplay = $sce.trustAsHtml($scope.challenge.presentation);
            }
            if($scope.challenge.localisation){
                console.log($scope.challenge.localisation)
                $scope.map = {
                    center: {
                        latitude: $scope.challenge.localisation.geometry.location.lat,
                        longitude: $scope.challenge.localisation.geometry.location.lng
                    },
                    zoom: 8
                };
            }

            $scope.noPage = 1;
            $scope.isEnd = false;
            $scope.loadMoreProjects = function (num) {
                $scope.noPage = num + 1;
                option.$skip = 6 * num;
                if (!$scope.isEnd) {
                    Project.fetch(option).then(function (result) {
                        if (result.length > 0) {
                            for (var i = 0; i < result.length; i++) {
                                $scope.projects.push(result[i]);
                            }
                        } else {
                            toaster.pop('info','the end','There is no more project !');
                            $scope.isEnd = true;
                        }
                    }).catch(function(err){
                        toaster.pop('error',err.status,err.message);
                    })
                }
            }

            // follow challenge
            if (loggedUser.profile) {
                console.log()
                if ($scope.challenge.followers.indexOf(loggedUser.profile.id) !== -1) {
                    $scope.isFollow = true;
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
.controller('ChallengeFollowerCtrl',function($scope,Challenge){
        $scope.followers = Challenge.data.followers;
    })
.controller('ChallengeCtrl',function($scope,Challenge,challenge,loggedUser,$modal){
        $scope.me = loggedUser.profile;

        $scope.challenge = Challenge.data = challenge[0];
        if(loggedUser.profile){
            if(loggedUser.profile.id == $scope.challenge.owner){
                $scope.isOwner = true;
            }
        }
    })

.controller('ChallengeSettingsCtrl',function($scope,Challenge,toaster){
        $scope.updateChallenge = function(challenge){
            Challenge.update(challenge).then(function(data){
                toaster.pop('success','success','Challenge updated successfully');
                console.log('success',data)
            }).catch(function(err){
                console.log('err',err)
                toaster.pop('error',err.status,err.message);
            })
        }
    })