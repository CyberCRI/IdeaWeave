angular.module('cri.topic',[])
    .controller('ProjectTopicDetailsCtrl',['$scope','$stateParams','Topic','toaster','Files','loggedUser','CONFIG','Comment','$sce',function($scope,$stateParams,Topic,toaster,Files,loggedUser,CONFIG,Comment,$sce){
        $scope.tid = $stateParams.tid;
//        $scope.myTopic = $scope.topics[$stateParams.tid];
        $scope.$parent.projectId = $stateParams.pid;
        $scope.$parent.topicId = $stateParams.tid;
        $scope.dropBoxHeight = "100px";

        angular.forEach($scope.topics,function(v,k){
            if(v.id === $stateParams.tid){
                $scope.myTopic = v;
            }
        })

        dpd.on('comments:create',function(data){
            if(data.container == $scope.myTopic.id){
                var notin = true;
                if(data.text){
                    $scope.comments.forEach(function(v,k){
                        if(v.id == data.id){
                            notin = false;
                        }
                    });
                    if(notin){
                        Comment.fetch({id:data.id}).then(function(result){
                            if($scope.comments.indexOf(result) == -1){
                                if(result.parent){
                                    angular.forEach($scope.comments,function(v,k){
                                        if(v.id == result.parent.id){
                                            result.displayText = $sce.trustAsHtml(result.text);
                                            $scope.comments[k].answers.push(result);
                                        }
                                    })
                                }else{
                                    result.displayText = $sce.trustAsHtml(result.text);
                                    $scope.comments.splice(0,0,result);
                                }
                            }
                        }).catch(function(err){
                            console.log('error',err);
                        })
                    }
                }
            }
        });


        $scope.comments=[];
        var childrens = [];
        console.log('topic',$scope.myTopic)
        Comment.fetch({container:$scope.myTopic.id}).then(function(result){
            console.log('comment',result)
            angular.forEach(result,function(comment,id){
                if(comment.text){
                    comment.displayText = $sce.trustAsHtml(comment.text);
                    if(comment.parent){
                        childrens.push(comment);

                    }else{
                        $scope.comments.splice(0,0,comment);
                    }
                }
            });
            if(childrens.length > 0){
                angular.forEach($scope.comments,function(v,k) {
                    $scope.comments[k].answers = [];
                    angular.forEach(childrens,function(cv,ck){
                        console.log('parent', v.id,cv.id)
                        if (v.id == cv.parent.id) {
                            console.log('parent !!!!! 1',k);
                            $scope.comments[k].answers.push(cv);
                            delete childrens[ck];
                            console.log('parent !!!!! 2',$scope.comments);
                        }
                    });

                });
                console.log('scope.comments    ',$scope.comments)
            }
        }).catch(function(err){
            console.log('error',err)
        })

        $scope.files = {};
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
    .controller('ProjectTopicCtrl',['$scope','project','$modal','loggedUser',function($scope,project,$modal,loggedUser){
        $scope.topics = project[0].topics;

        $scope.me = loggedUser.profile;
        $scope.tf={};

        $scope.filterTopics = function(value){
            $scope.search = {
                type : value
            };
            $scope.isActive = value;
        }

        $scope.popUpTopic = function(){
            var myModal = $modal.open({
                templateUrl: 'modules/topic/templates/add-topic.tpl.html',
                controller: ['$scope','Topic','toaster','$modalInstance','CONFIG',function ($scope,Topic,toaster,$modalInstance,CONFIG) {
                    $scope.tinymceOptions = CONFIG.tinymceOptions;
                    $scope.categories = [
                        {
                            id : '1',
                            title : 'Discussion'
                        },
                        {
                            id : '2',
                            title : 'Protocole'
                        },
                        {
                            id : '3',
                            title : 'Experiment'
                        },
                        {
                            id : '4',
                            title : 'Result'
                        }
                    ];

                    $scope.addTopic=function(topic){
//                        topic = Topic.urlify(topic.text);
//                        topic = Topic.getUrl(topic.text);
                        topic.type = topic.type.id;
                        topic.container=project[0].id;
                        console.log(topic)
                        Topic.createPost(topic,'project').then(function(result){
                            toaster.pop('success','you earn points !!!', 'Add a topic ! Cool for 10 points.');
                            $modalInstance.close(result);
                        }).catch(function(err){
                            toaster.pop('error',err.status,err.message);
                        })
                    }
                }],
                size: 'lg'
            });

            myModal.result.then(function(data){
                console.log('modal then',data)
                $scope.topics.push(data);
            })
        };



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
                });
                angular.forEach(project[0].member,function(vm,km){
                    if(v.owner === vm){
                        $scope.topicsCss[k] = 'member';
                    }
                })
            }
        })
    }]);