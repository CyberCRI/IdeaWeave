angular.module('cri.workspace',[])
    .controller('NoteHackpadCtrl',function($scope,Notification,NoteLab,$http,Config){

        $scope.myNote = NoteLab.data;
        console.log($scope.currentUser)
//        $scope.hackpadUrl = $sce.trustAsResourceUrl('https://hackpad.com/'+NoteLab.data.hackPadId);

        $scope.exportHackPad = function(){
            NoteLab.exportHackPad($scope.myNote.hackPadId).then(function(data){
                console.log(data)
                Notification.display('note successfully saved')
            }).catch(function(err){
                console.log('error',err)
            })
        }
    })
    .controller('NoteCtrl',['$scope','$stateParams','NoteLab','Pdf','Notification',function($scope,$stateParams,NoteLab,Pdf,Notification){
        $scope.$parent.projectId = $stateParams.pid;
        $scope.$parent.noteId = $stateParams.tid;
        $scope.dropBoxHeight = "100px";

        angular.forEach($scope.notes,function(note){
            if(note._id == $stateParams.tid){
                $scope.myNote = note;
                NoteLab.data = $scope.myNote;
            }
        });

        $scope.toPdf = function(){
            console.log('rr')
            Pdf.fromHtml();
        }
    }])
    .controller('WorkspaceCtrl',['$scope','notes','$materialDialog','NoteLab','Challenge','$materialSidenav','project',function($scope,notes,$materialDialog,NoteLab,Challenge,$materialSidenav,project){
        if(notes.length){
            $scope.notes = notes;
        }else{
            $scope.notes = [];
        }

        $scope.project = project[0];

        $scope.$on('newNote',function(e,note){
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
                templateUrl: 'modules/workspace/templates/modal/addNoteModal.tpl.html',
                targetEvent: e,
                locals : {
                    currentUser : $scope.currentUser,
                    project : $scope.project
                },
                resolve : {
                    templates : function(){
                        return Challenge.getTemplates($scope.project.container)
                    }
                },
                controller: ['$scope', 'NoteLab', 'Notification', '$hideDialog', 'Config','templates','currentUser','project', function ($scope, NoteLab, Notification, $hideDialog, Config,templates,currentUser,project) {
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

                    $scope.tinymceOptions = angular.copy(Config.tinymceOptions);
                    $scope.tinymceOptions.template_replace_values = {
                        user : currentUser.username
                    };
                    $scope.tinymceOptions.templates = templates;

                    $scope.createNote = function (note) {
                        note.type = note.type.id;
                        note.project = project._id;
                        note.owner = currentUser._id;
                        NoteLab.createNote(note).then(function (result) {
                            Notification.display('Note created, now you can edit it with your team');
//                            notes.push(result);
                        }).catch(function (err) {
                            Notification.display('error the note is not created');
                        }).finally(function(){
                            $hideDialog();
                        })
                    }
                }]
            });
        };
    }])
    .controller('NoteResourcesCtrl',function($scope,NoteLab,$stateParams,Notification,$materialDialog){
        $scope.addResourceModal = function(e) {
            $materialDialog({
                templateUrl: 'modules/workspace/templates/modal/addResourceModal.tpl.html',
                event: e,
                locals : {
                    urls : $scope.urls
                },
                controller: ['$scope', 'NoteLab', '$hideDialog','urls', function ($scope, NoteLab, $hideDialog, urls) {
                    $scope.cancel = function () {
                        $hideDialog();
                    };
                    $scope.addUrl = function(url){
                        url.project = myNote.container;
                        url.container = $stateParams.tid;
                        url.owner = userId;

                        NoteLab.addUrl(url).then(function(data){
                            urls.push(url);
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
    })
    .controller('NoteFilesCtrl',function($scope,Files,NoteLab,$materialDialog,$stateParams,Notification){
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
                templateUrl: 'modules/workspace/templates/modal/fileDetailModal.tpl.html',
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
        });
        $scope.uploadFileModal = function(e){
            $materialDialog({
                templateUrl : 'modules/workspace/templates/modal/fileUploadModal.tpl.html',
                event : e,
                locals : {
                    currentUser : $scope.currentUser,
                    files : $scope.files
                },
                controller : ['$scope','NoteLab','$hideDialog','Notification','Files','currentUser','files',function($scope,NoteLab,$hideDialog,Notification,Files,currentUser,files){

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
                        NoteLab.uploadFile(NoteLab.data, file,description,currentUser._id).then(function(file){
                            Notification.display('your file has been uploaded !!!');
                            $scope.file = null;
                            $scope.fileUrl = null;
                            $scope.dropBoxHeight = "100px";
                            Files.getPoster(file);
//                data[0].url = Config.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+data[0].filename;
                            files.push(file);
                        }).catch(function(err){
                            Notification.display(err.message);
                        }).finally(function(){
                            $scope.isUploading = false;
                            $hideDialog()
                        })
                    };
                    $scope.cancel = function(){
                        $hideDialog();
                    }
                }]
            })
        };
    })
