angular.module('cri.workspace',[])
    .controller('NoteHackpadCtrl',function($scope,Notification,NoteLab,$http,Config){

        $scope.myNote = NoteLab.data;
//        $scope.hackpadUrl = $sce.trustAsResourceUrl('https://hackpad.com/'+NoteLab.data.hackPadId);

        $scope.exportHackPad = function(){
            NoteLab.exportHackPad($scope.myNote.hackPadId).then(function(data){
                Notification.display('note successfully saved');
            }).catch(function(err){
                console.log('error',err);
            });
        };
    })
    .controller('NoteCtrl',['$scope','$stateParams','NoteLab','Pdf','Notification',function($scope,$stateParams,NoteLab,Pdf,Notification){
        $scope.$parent.projectId = $stateParams.pid;
        $scope.$parent.noteId = $stateParams.tid;
        $scope.dropBoxHeight = "100px";

        $scope.toPdf = function(){
            Pdf.fromHtml();
        };
    }])
    .controller('WorkspaceCtrl',function($scope,$materialDialog,NoteLab,Challenge,$materialSidenav,project){
        $scope.project = project[0];

        var leftNav;
        $scope.toggle = function(){
            leftNav.toggle();
        };

        $scope.$on('showWorkspace',function(){
            leftNav = $materialSidenav('left');
            leftNav.toggle();
        });

    })
    .controller('NoteResourcesCtrl',function($scope,NoteLab,$stateParams,Notification,$materialDialog){
        $scope.addResourceModal = function(e) {
            $materialDialog({
                templateUrl: 'modules/workspace/templates/modal/addResourceModal.tpl.html',
                event: e,
                locals : {
                    urls : $scope.urls,
                    currentUser : $scope.currentUser,
                    project: $scope.project
                },
                controller: function ($scope, NoteLab, $hideDialog, urls, currentUser, project) {
                    $scope.cancel = function () {
                        $hideDialog();
                    };
                    $scope.addUrl = function(url){
                        NoteLab.addUrl(project._id, url).then(function(data){
                            urls.push(data);
                            $hideDialog();
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    };
                }
            });
        };

        $scope.removeUrl = function(url) {
            NoteLab.removeUrl($scope.project._id, url._id).then(function() {
                // Delete the URL from the list
                var urlIndex = $scope.urls.indexOf(url);
                $scope.urls.splice(urlIndex, 1);
            }).catch(function(err) {
                Notification.display(err);
            });
        };

        NoteLab.listUrls($scope.project._id).then(function(data){
            $scope.urls = data;
        }).catch(function(err){
            Notification.display(err);
        });
    })
    .controller('NoteFilesCtrl',function($scope,Files,NoteLab,$materialDialog,$stateParams,Notification){
        $scope.files = [];
        NoteLab.fetchFile($stateParams.tid).then(function(data){
            $scope.files = data || [];
            angular.forEach($scope.files,function(file){
                Files.getPoster(file);
//                file.url = Config.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+file.filename;
            });
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
                            $hideDialog();
                        });
                    };
                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }]
            });
        };
    });