angular.module('cri.noteLab',[])
    .controller('NoteLabDetailsCtrl',['$scope','$stateParams','NoteLab','Notification','Files','$materialDialog',function($scope,$stateParams,NoteLab,Notification,Files,$materialDialog){
        $scope.$parent.projectId = $stateParams.pid;
        $scope.$parent.topicId = $stateParams.tid;
        $scope.dropBoxHeight = "100px";

        var myTopic;
        angular.forEach($scope.notes,function(v,k){
            if(v._id === $stateParams.tid){
                $scope.myTopic = v;
                myTopic = v;
            }
        });

        $scope.joinHackPad = function(){
            $materialDialog({
                templateUrl : 'modules/noteLab/templates/modal/hackpadModal.tpl.html',
                clickOutsideToClose : false,
                escapeToClose : false,
                locals : {
                    note : $scope.myTopic
                },
                controller : ['$scope','note','$sce','$hideDialog','Notification',function($scope,note,$sce,$hideDialog,Notification){
                    $scope.url = $sce.trustAsResourceUrl('https://hackpad.com/'+note.hackPadId);
                    $scope.id = note.hackPadId;
                    $scope.cancel = function(){
                        $hideDialog();
                    };
                    $scope.exportHackPad = function(){
                      NoteLab.exportHackPad(note.hackPadId).then(function(data){
                          Notification.display('note successfully saved')
                          note.text = $sce.trustAsHtml(data.text);
                      }).catch(function(err){
                        console.log('error',err)
                      })
                    }
                }]
            })
        };

        $scope.files = [];
        NoteLab.fetchFile($stateParams.tid).then(function(data){
            $scope.files = data || [];
            angular.forEach($scope.files,function(file){
                Files.getPoster(file);
//                file.url = Config.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+file.filename;
            })
        }).catch(function(err){
//            Notification.display(err.message);
        });


        $scope.detailsFileModal = function(e,file){
            $materialDialog({
                templateUrl: 'modules/noteLab/templates/modal/fileDetailModal.tpl.html',
                event: e,
                controller: ['$scope','$hideDialog','Files', function ($scope,$hideDialog,Files) {
                    $scope.fileDetails = file;
                    $scope.cancel = function(){
                        $hideDialog();
                    };
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

                }]
            });
        };

        if($scope.currentUser){
            var userId = $scope.currentUser._id;
        }
        $scope.$on('file::upload',function(e,file){
            Files.getPoster(file);
            $scope.files.push(file);
        });
        $scope.uploadFileModal = function(e){
            $materialDialog({
                templateUrl : 'modules/noteLab/templates/modal/fileUploadModal.tpl.html',
                event : e,
                controller : ['$scope','NoteLab','$hideDialog','Notification','Files','$rootScope',function($scope,NoteLab,$hideDialog,Notification,Files,$rootScope){

                    $scope.fileSelected = function($files){
                        $scope.file = $files[0];
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

                    $scope.upload = function(file,description){
                        $scope.isUploading = true;
                        NoteLab.uploadFile(myTopic, file,description,userId).then(function(data){
                            Notification.display('your file has been uploaded !!!');
                            $scope.file = null;
                            $scope.fileUrl = null;
                            $scope.dropBoxHeight = "100px";
//                            Files.getPoster(data);
//                data[0].url = Config.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+data[0].filename;
                            $rootScope.$broadcast('file::upload',data);
                            $hideDialog()
                        }).catch(function(err){
                            Notification.display(err.message);
                            $hideDialog();
                        }).finally(function(){
                            $scope.isUploading = false;
                        })
                    };
                    $scope.cancel = function(){
                        $hideDialog();
                    }
                }]
            })
        };
        $scope.$on('url::created',function(e,url){
            if(!$scope.urls){
                $scope.urls = [];
            }
            $scope.urls.push(url);
        });
        $scope.addResourceModal = function(e) {
            $materialDialog({
                templateUrl: 'modules/noteLab/templates/modal/addResourceModal.tpl.html',
                event: e,
                controller: ['$scope', 'NoteLab', '$hideDialog','$rootScope', function ($scope, NoteLab, $hideDialog, $rootScope) {
                    $scope.cancel = function () {
                        $hideDialog();
                    };
                    $scope.addUrl = function(url){
                        url.project = myTopic.container;
                        url.container = $stateParams.tid;
                        url.owner = userId;

                        NoteLab.addUrl(url).then(function(data){
                            $rootScope.$broadcast('url::created',data);
                            $hideDialog();
                        }).catch(function(err){
                            Notification.display(err.message);
                        })
                    }
                }]
            });
        };
        NoteLab.fetchUrl($stateParams.tid).then(function(data){
            $scope.urls = data;
        }).catch(function(err){
            Notification.display(err.message);
        });

        $scope.files = [];
        NoteLab.fetchFile($stateParams.tid).then(function(data){
            $scope.files = data || [];
            angular.forEach($scope.files,function(file){
                Files.getPoster(file);
//                file.url = Config.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+file.filename;
            })
        }).catch(function(err){
//            Notification.display(err.message);
        });

    }])
    .controller('NoteLabCtrl',['$scope','notes','$materialDialog','NoteLab','Challenge','$materialSidenav',function($scope,notes,$materialDialog,NoteLab,Challenge,$materialSidenav){
        if(notes.length){
            $scope.notes = notes;
        }else{
            $scope.notes = [];
        }

        $scope.$on('newNote',function(e,note){
            console.log(note)
            $scope.notes.push(note);
        });

        var leftNav;
        $scope.toggle = function(){
            leftNav.toggle();
        };

        $scope.$on('showWorkspace',function(){
            leftNav = $materialSidenav('left');
            leftNav.toggle();
        });



        var projectId = $scope.project._id;
        if($scope.currentUser){
            var userId = $scope.currentUser._id;
        }

        $scope.tf={};
        $scope.filterTopics = function(value){
            $scope.search = {
                type : value
            };
            $scope.isActive = value;
        };
        $scope.categories = [
            {
                title : "All"
            },
            {
                id: '1',
                title: 'Discussion'
            },
            {
                id: '2',
                title: 'Protocole'
            },
            {
                id: '3',
                title: 'Experiment'
            },
            {
                id: '4',
                title: 'Result'
            }
        ];

        $scope.popUpTopic = function(e) {

            $materialDialog({
                templateUrl: 'modules/noteLab/templates/modal/addNoteModal.tpl.html',
                targetEvent: e,
                locals : {
                  currentUser : $scope.currentUser,
//                  templates : 'toto',
                  notes : $scope.notes
                },
                resolve : {
                    templates : function(){
                        return Challenge.getTemplates($scope.project.container)
                    }
                },
                controller: ['$scope', 'NoteLab', 'Notification', '$hideDialog', 'Config','templates','currentUser','notes', function ($scope, NoteLab, Notification, $hideDialog, Config,templates,currentUser,notes) {
                    $scope.categories = [
                        {
                            title : "All"
                        },
                        {
                            id: '1',
                            title: 'Discussion'
                        },
                        {
                            id: '2',
                            title: 'Protocole'
                        },
                        {
                            id: '3',
                            title: 'Experiment'
                        },
                        {
                            id: '4',
                            title: 'Result'
                        }
                    ];

                    $scope.cancel = function(){
                        $hideDialog();
                    };



                    var tinymceOption = angular.copy(Config.tinymceOptions);
                    tinymceOption.template_replace_values = {
                        user : currentUser.username
                    };
                    tinymceOption.templates = templates;
                    $scope.tinymceOptions = tinymceOption;


                    $scope.createNote = function (note) {
                        note.type = note.type.id;
                        note.project = projectId;
                        note.owner = userId;
                        NoteLab.createNote(note).then(function (result) {
                            Notification.display('Note created, now you can edit it with your team');
                            $hideDialog();
                        }).catch(function (err) {
                            Notification.display(err.message);
                            $hideDialog();
                        })
                    }
                }]
            });
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