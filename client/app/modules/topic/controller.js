angular.module('cri.topic',[])
    .controller('ProjectTopicDetailsCtrl',['$scope','$stateParams','Topic','toaster','Files','loggedUser',function($scope,$stateParams,Topic,toaster,Files,loggedUser){
        $scope.myTopic = $scope.topics[$stateParams.tid]
        $scope.$parent.projectId = $stateParams.pid;
        $scope.$parent.topicId = $stateParams.tid;
        $scope.dropBoxHeight = "100px";

        console.log($scope.myTopic)

        Topic.fetchUrl($scope.myTopic.id).then(function(data){
            $scope.myTopic.urls = data;
        }).catch(function(err){
            toaster.pop(err.status,err.message)
        })

        angular.forEach($scope.myTopic.files,function(file){
            Files.getPoster(file);
        })

        $scope.isImage = function(file){
            return Files.isImage(file);
        }

        $scope.isVideo = function(file){
            return Files.isVideo(file);
        }

        $scope.isPdf = function(file){
            return Files.isPdf(file);
        }

        $scope.isOfficeDoc = function(file){
            return Files.isOfficeDoc(file);
        }


        $scope.showFileDetails = function(index){
            $scope.fileDetails = $scope.myTopic.files[index];
        }

        $scope.fileSelected = function($files){
            $scope.file = $files[0];
            console.log($scope.file)
            if(Files.isImage($scope.file)){
                Files.getDataUrl($scope.file).then(function(dataUrl){
                    $scope.fileUrl = dataUrl;
                })
                $scope.dropBoxHeight = "300px";
            }
        }


        $scope.cancelUpload = function(){
            $scope.file = null;
            $scope.fileUrl = null;
            $scope.dropBoxHeight = "100px";
        }

        $scope.upload = function(topic,file,description){
            Topic.uploadFile(topic, file,description).then(function(data){
                toaster.pop('success','upload success','your file has been uploaded !!!');
                $scope.file = null;
                $scope.fileUrl = null;
                $scope.dropBoxHeight = "100px";
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }

        $scope.addUrl = function(url){
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
    .controller('ProjectTopicCtrl',['$scope','Project','Topic','toaster','project','CONFIG',function($scope,Project,Topic,toaster,project,CONFIG){
        $scope.topics = project[0].topics;

        $scope.tinymceOptions = CONFIG.tinymceOptions;

        $scope.tf={};
        $scope.addTopic=function(){
            $scope.tf.text = Topic.urlify($scope.tf.text);
            $scope.tf.urls = Topic.getUrl($scope.tf.text);
            $scope.tf.container=project[0].id;
            Topic.createPost($scope.tf,'project').then(function(result){
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
            if(v.owner === project[0].owner ){
                $scope.topicsCss[k] = 'owner'
            }else{
                $scope.topicsCss[k] = 'visitor';
                angular.forEach(project[0].followers,function(vf,kf){
                    if(v.owner === vf){
                        $scope.topicsCss[k] = 'follower';
                    }
                })
                angular.forEach(project[0].member,function(vm,km){
                    if(v.owner === vm){
                        $scope.topicsCss[k] = 'member';
                    }
                })
            }
        })
    }])