angular.module('cri.admin.project',[])
    .controller('AdminProjectCtrl', function($scope,project,Project,$q){
        $scope.project = project[0];
    })
    .controller('ProjectEditCtrl',['$scope','$stateParams','Project','$state','Notification','Config','$materialDialog','$materialSidenav','Gmap',function ($scope,$stateParams,Project,$state,Notification,Config,$materialDialog,$materialSidenav,Gmap) {

        var leftNav;
        $scope.toggle = function(){
            leftNav.toggle();
        };

        $scope.$on('showAdmin',function(){
            leftNav = $materialSidenav('left');
            leftNav.toggle();
        });

        $scope.options = {
            height: 200,
            focus: true
        };

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            });
        };

        $scope.popUpPoster = function($event){
            $materialDialog({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-crop-poster-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    project : $scope.project
                },
                controller : ['$scope','$hideDialog','project',function($scope,$hideDialog,project){
                    $scope.imageCropResult = null;
                    $scope.$watch('imageCropResult',function(dataUri,e){
                        if(dataUri){
                            var newProject= {
                                poster : dataUri
                            };
                            Project.update(project._id,newProject).then(function(data){
                                Notification.display('Updated successfully');
                            }).catch(function(err){
                                Notification.display(err.message);
                            }).finally(function(){
                                $hideDialog();
                            });
                        }
                    });

                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }]

            });
        };

        $scope.popUpBanner = function(){
            $materialDialog({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-crop-banner-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    project : $scope.project
                },
                controller : ['$scope','$hideDialog','project',function($scope,$hideDialog,project){
                    $scope.imageCropResult = null;
                    $scope.$watch('imageCropResult',function(dataUri,e){
                        if(dataUri){
                            var newProject = {
                                banner : dataUri
                            };
                            Project.update(project._id,newProject).then(function(data){
                                Notification.display('Updated successfully');
                            }).catch(function(err){
                                Notification.display(err.message);
                            }).finally(function(){
                                $hideDialog();
                            });
                        }
                    });

                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }]

            });
        };
        $scope.popUpEdit = function(){
            $materialDialog({
                templateUrl : 'modules/admin/project/templates/modal/homePageModal.tpl.html',
                locals : {
                    project : $scope.project
                },
                controller : ['$scope','$hideDialog','project','Config',function($scope,$hideDialog,project,Config){
                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.newProject = {};
                    $scope.newProject.home = project.home;
                    $scope.update = function(newProject){
                        $scope.isLoading = true;
                        Project.update(project._id,newProject).then(function(data){
                            Notification.display('Updated successfully');
                            _.extend(project, newProject);
                        }).catch(function(err){
                            Notification.display(err.message);
                        }).finally(function(){
                            $scope.isLoading = false;
                            $hideDialog();
                        });
                    };
                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }]
            });
        };

        $scope.popUpRemove = function(){
            $materialDialog({
                templateUrl : 'modules/admin/project/templates/modal/project-remove-modal.tpl.html',
                locals : {
                    project : $scope.project
                },
                controller : ['$scope','$hideDialog','project',function($scope,$hideDialog,project){
                    $scope.projectTitle = project.title

                    $scope.delete = function(){
                        Project.delete(project._id).then(function(){
                            Notification.display(project.title+' successfully removed');
                            $state.go("home");
                        }).catch(function(err){
                            Notification.display('Error, the project was not removed');
                        }).finally(function(){
                            $hideDialog();
                        });
                    };
                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }]

            });
        };

        $scope.updateProject=function() {
            Project.update($scope.project._id, $scope.project).then(function (result) {
                Notification.display('Updated');
            }).catch(function (err) {
                Notification.display(err.message);
            });
        };
    }])
    .controller('ProjectMediaCtrl',['$scope', 'Notification','Files','Url','Config',function ($scope, Notification,Files,Url,Config) {
        $scope.removeFile = function(file){
            Files.remove(file.id).then(function(){
                Notification.display('File removed');
                $scope.files.splice($scope.files.indexOf(file),1);
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

        angular.forEach($scope.files,function(file,index){
            $scope.files[index].url = Config.apiServer+'/fileUpload/topic/'+file.projectUrl+'/'+file.filename;
        });


        $scope.updateUrl = function(url){
            Url.update(url).then(function(data){
                Notification.display('URL updated');
            }).catch(function(err){
                Notification.display('Update failed');
            });
        };
    }])


    .controller('ProjectTeamCtrl',['$scope','Project','Notification','$materialDialog',function ($scope,Project,Notification,$materialDialog) {   
        /* TEMPORARILY DEACTIVATED: missing server functionality

        $scope.inviteModal = function(e){
            $materialDialog({
                templateUrl : 'modules/admin/project/templates/modal/inviteModal.tpl.html',
                locals : {
                    project : $scope.project
                },
                controller : function($scope,$hideDialog,project){
                    $scope.invite = {};
                    $scope.sendInvite = function(){
                        $scope.invite.pid = project._id;
                        Project.sendInvite($scope.invite).then(function(result){
                            Notification.display('Invitation sent successfully');
                            $scope.invite.email="";
                        }).catch(function(err){
                            Notification.display('Failed, please try again later.');
                        });
                    };
                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }
            });
        };
        */

        $scope.ban=function(userId){
            Project.banMember($scope.project._id, { member : userId }).then(function(result){
                Notification.display('Successfully removed');
                $scope.project.members.splice($scope.project.members.indexOf(userId),1);
            }).catch(function(err){
                Notification.display('Ban failed, please try again later');
            });
        };

        Project.getApply({container:$scope.project._id}).then(function(applyteams){
            $scope.applyteams=applyteams;
        }).catch(function(err){
            console.log(err);
        });

        $scope.finish=function($index,accepted){
            Project.finishApply({status:true,accepted : accepted},  $scope.applyteams[$index]._id).then(function(data){
                $scope.applyteams[$index].status=true;
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

        $scope.fail = function($index){
            $scope.finish($index,false);
        };

        $scope.addToTeam=function(userId,$index){
            Project.addToTeam($scope.project._id,{userId : userId}).then(function(member){
                $scope.project.members.push(member);
                $scope.finish($index,true);
                Notification.display('Successfully added');
            }).catch(function(err){
                Notification.display(err.message);
            });
        };
    }]);