angular.module('cri.workspace',[])
    .controller('WorkspaceCtrl',function($scope,NoteLab,Challenge,$mdSidenav,project,$state,$mdDialog,Notification,Config,$stateParams,Files){
        $scope.project = project[0];


        $scope.etherpadTemplateUrl = '';
        $scope.etherpadTemplateUrl = 'modules/workspace/templates/etherpad.tpl.html';

        var leftNav;
        $scope.toggle = function(){
            leftNav.toggle();
        };

        $scope.$on('showWorkspace',function(){
            leftNav = $mdSidenav('left');
            leftNav.toggle();
        });

        $scope.toPdf = function(){
            Pdf.fromHtml();
        };

        $scope.dropBoxHeight = "100px";

        // Set initial selected tab
        if($state.current.name == "workspace.etherpad") $scope.selectedTabIndex = 0;
        else if($state.current.name == "workspace.file") $scope.selectedTabIndex = 1;
        else if($state.current.name == "workspace.resources") $scope.selectedTabIndex = 2;
        else $scope.selectedTabIndex = -1;




        $scope.addResourceModal = function(e) {
            $mdDialog.show({
                templateUrl: 'modules/workspace/templates/modal/addResourceModal.tpl.html',
                event: e,
                locals : {
                    urls : $scope.urls,
                    currentUser : $scope.currentUser,
                    project: $scope.project
                },
                controller: function ($scope, NoteLab, urls, currentUser, project) {
                    $scope.cancel = function () {
                        $mdDialog.hide();
                    };
                    $scope.addUrl = function(url){
                        NoteLab.addUrl(project._id, url).then(function(data){
                            urls.push(data);
                            $mdDialog.hide();
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



        $scope.files = [];
        NoteLab.listFiles($scope.project._id).then(function(data){
            $scope.files = data || [];
            angular.forEach($scope.files,function(file){
                Files.getPoster(file);
                file.url = Config.apiServer + "/files/" + file.name;
//                file.url = Config.apiServer+'/fileUpload/topic/'+$stateParams.pid+'/'+file.filename;
            });
        }).catch(function(err){
            Notification.display(err.message);
        });


        $scope.detailsFileModal = function(e,file){
            $mdDialog.show({
                templateUrl: 'modules/workspace/templates/modal/fileDetailModal.tpl.html',
                event: e,
                locals : {
                    currentUser : $scope.currentUser,
                    files : $scope.files,
                    project: $scope.project
                },
                controller: function ($scope,Files,project,files) {
                    $scope.fileDetails = file;
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };

                    $scope.removeFile = function() {
                        NoteLab.removeFile(project._id, file._id).then(function() {
                            // Delete the file from the list
                            var fileIndex = files.indexOf(file);
                            files.splice(fileIndex, 1);
                            $mdDialog.hide();
                        }).catch(function(err) {
                            Notification.display(err);
                        });
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

                }
            });
        };

        if($scope.currentUser){
            var userId = $scope.currentUser._id;
        }
        $scope.$on('file::upload',function(e,file){
            Files.getPoster(file);
        });
        $scope.uploadFileModal = function(e){
            $mdDialog.show({
                templateUrl : 'modules/workspace/templates/modal/fileUploadModal.tpl.html',
                event : e,
                locals : {
                    currentUser : $scope.currentUser,
                    files : $scope.files,
                    project: $scope.project
                },
                controller : function($scope,NoteLab,Notification,Files,currentUser,files,project){
                    $scope.selectedFiles = null;
                    $scope.file = null;
                    $scope.fileUrl = null;
                    $scope.description = null;

                    $scope.$watch('selectedFiles', function () {
                        if(!$scope.selectedFiles || $scope.selectedFiles.length === 0) return;

                        $scope.file = $scope.selectedFiles[0];
                        if(Files.isImage($scope.file)){
                            Files.getDataUrl($scope.file).then(function(dataUrl){
                                $scope.fileUrl = dataUrl;
                            });
                        }
                        $scope.selectedFiles = null;
                    });

                    $scope.cancelUpload = function(){
                        $scope.file = null;
                        $scope.fileUrl = null;
                        $scope.description = null;
                    };

                    $scope.upload = function(){
                        $scope.isUploading = true;
                        NoteLab.uploadFile(project._id, $scope.description, $scope.file).then(function(file){
                            Notification.display('Your file has been uploaded');
                            $scope.file = null;
                            $scope.fileUrl = null;
                            Files.getPoster(file);
                            files.push(file);
                        }).catch(function(err){
                            Notification.display(err.message);
                        }).finally(function(){
                            $scope.isUploading = false;
                            $mdDialog.hide();
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };
    });