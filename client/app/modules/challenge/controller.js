angular.module('cri.challenge', [])
    .controller('cTopicCtrl',['$scope','CONFIG','toaster','Topic',function($scope,CONFIG,toaster,Topic){
        console.log('ctopic',$scope)
        $scope.topics = $scope.challenge.topics;

        $scope.tinymceOptions = CONFIG.tinymceOptions;

        $scope.tf={};
        $scope.addTopic=function(){
            $scope.tf.text = Topic.urlify($scope.tf.text);
            $scope.tf.urls = Topic.getUrl($scope.tf.text);
            $scope.tf.container=$scope.challenge.id;
            $scope.tf.owner=$scope.me.id
            Topic.createPost($scope.tf,'challenge').then(function(result){
                toaster.pop('success','you earn points !!!', 'Add a topic ! Cool for 10 points.');
                $scope.hideTopic=true;
                $scope.tf={};
                $scope.topics.push(result);
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }

        //topic css classes
        $scope.topicsCss = [];
        angular.forEach($scope.topics,function(v,k){
            if(v.owner === $scope.challenge.owner ){
                $scope.topicsCss[k] = 'owner'
            }else{
                $scope.topicsCss[k] = 'visitor';
                angular.forEach($scope.challenge.followers,function(vf,kf){
                    if(v.owner === vf){
                        $scope.topicsCss[k] = 'follower';
                    }
                });
                angular.forEach($scope.challenge.member,function(vm,km){
                    if(v.owner === vm){
                        $scope.topicsCss[k] = 'member';
                    }
                })
            }
        })
    }])
    .controller('cTopicDetailsCtrl',['$scope','$stateParams','Topic','toaster','Files','loggedUser','CONFIG',function($scope,$stateParams,Topic,toaster,Files,loggedUser,CONFIG){
        $scope.myTopic = $scope.topics[$stateParams.tid];
        $scope.$parent.projectId = $stateParams.pid;
        $scope.$parent.topicId = $stateParams.tid;
        $scope.dropBoxHeight = "100px";


        Topic.fetchFile($scope.myTopic.id).then(function(data){
            $scope.files = data || [];
            angular.forEach($scope.files,function(file){
                Files.getPoster(file);
                file.url = CONFIG.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+file.filename;
            })
        }).catch(function(err){
            toaster.pop(err.status,err.message);
        });


        Topic.fetchUrl($scope.myTopic.id).then(function(data){
            $scope.myTopic.urls = data;
        }).catch(function(err){
            toaster.pop(err.status,err.message);
        });


        $scope.isImage = function(file){
            return Files.isImage(file);
        };

        $scope.isVideo = function(file){
            return Files.isVideo(file);
        };

        $scope.isPdf = function(file){
            return Files.isPdf(file);
        };

        $scope.isOfficeDoc = function(file){
            return Files.isOfficeDoc(file);
        };


        $scope.showFileDetails = function(file){
            $scope.fileDetails = file;
        };

        $scope.fileSelected = function($files){
            $scope.file = $files[0];
            console.log($scope.file);
            if(Files.isImage($scope.file)){
                Files.getDataUrl($scope.file).then(function(dataUrl){
                    $scope.fileUrl = dataUrl;
                });
                $scope.dropBoxHeight = "300px";
            }
        };


        $scope.cancelUpload = function(){
            $scope.file = null;
            $scope.fileUrl = null;
            $scope.dropBoxHeight = "100px";
        };

        $scope.upload = function(topic,file,description){
            Topic.uploadFile(topic, file,description).then(function(data){
                toaster.pop('success','upload success','your file has been uploaded !!!');
                $scope.file = null;
                $scope.fileUrl = null;
                $scope.dropBoxHeight = "100px";
                Files.getPoster(data[0]);
                data[0].url = CONFIG.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+data[0].filename;
                $scope.files.push(data[0]);
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        };

        $scope.addUrl = function(url){
            url.project = $stateParams.pid;
            url.container = $scope.myTopic.id;
            url.owner = loggedUser.profile.id;
            Topic.addUrl(url).then(function(data){
                if(!$scope.myTopic.urls){
                    $scope.myTopic.urls = [];
                }
                $scope.myTopic.urls.push(url);
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])
    .controller('ChallengeExploreCtrl', ['$scope', 'challenges','users','Challenge','toaster', function ($scope, challenges, users, Challenge, toaster) {

        $scope.filterMode = false;

        $scope.enableFilterMode = function(){
            $scope.filterMode = !$scope.filterMode;
        }

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
    }])
    .controller('ChallengeViewCtrl', ['$scope', 'challenge','users', 'Challenge','Project','$sce','toaster','loggedUser','CONFIG',
        function ($scope, challenge,users, Challenge, Project, $sce, toaster, loggedUser, CONFIG) {
            $scope.user = users;
            $scope.isFollow = false;
            $scope.challenge = Challenge.data = challenge[0];
            $scope.mapOptions = CONFIG.mapOptions;
            if($scope.challenge.presentation){
                $scope.challenge.presentationDisplay = $sce.trustAsHtml($scope.challenge.presentation);
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
        }])
.controller('ChallengeFollowerCtrl',['$scope','Challenge',function($scope,Challenge){
        $scope.followers = Challenge.data.followers;
    }])
.controller('ChallengeCtrl',['$scope','Challenge','challenge','loggedUser','toaster','$state',function($scope,Challenge,challenge,loggedUser,toaster,$state){
        $scope.me = loggedUser.profile;

        $scope.challenge = Challenge.data = challenge[0];
        console.log($scope.challenge)
        if(loggedUser.profile){
            if(loggedUser.profile.id == $scope.challenge.owner){
                $scope.isOwner = true;
            }
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

.controller('ChallengeSettingsCtrl',['$scope','Challenge','toaster',function($scope,Challenge,toaster){

        console.log($scope.challenge)
        $scope.$watch('imageCropResult', function(newVal) {
            console.log('rr',newVal)
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
                console.log('success',data)
            }).catch(function(err){
                console.log('err',err)
                toaster.pop('error',err.status,err.message);
            })
        }
    }])