angular.module('cri.admin.project',[])
    .controller('AdminProjectCtrl', function($scope,project,Project,$q){
        $scope.project = project[0];
    })
    .controller('ProjectEditCtrl', function ($scope,$stateParams,Project,Challenge,$state,Notification,Config,$mdDialog,$mdSidenav,Gmap) {
        var leftNav;
        $scope.toggle = function(){
            leftNav.toggle();
        };

        $scope.$on('showAdmin',function(){
            leftNav = $mdSidenav('left');
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
            $mdDialog.show({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-crop-poster-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    project : $scope.project
                },
                controller : function($scope,project){
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
                                $mdDialog.hide();
                            });
                        }
                    });

                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.popUpBanner = function(){
            $mdDialog.show({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-crop-banner-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    project : $scope.project
                },
                controller : function($scope,project){
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
                                $mdDialog.hide();
                            });
                        }
                    });

                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };
        $scope.popUpEdit = function(){
            $mdDialog.show({
                templateUrl : 'modules/admin/project/templates/modal/homePageModal.tpl.html',
                locals : {
                    project : $scope.project,
                    templates: Challenge.getTemplates($scope.project.container)
                },
                controller : function($scope,project,Config,templates){
                    $scope.newProject = {};
                    $scope.newProject.home = project.home;

                    $scope.tinymceOption = _.extend({}, Config.tinymceOptions, {
                        templates: templates
                    });

                    $scope.update = function(newProject){
                        $scope.isLoading = true;
                        Project.update(project._id,newProject).then(function(data){
                            Notification.display('Updated successfully');
                            _.extend(project, newProject);
                        }).catch(function(err){
                            Notification.display(err.message);
                        }).finally(function(){
                            $scope.isLoading = false;
                            $mdDialog.hide();
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.popUpRemove = function(){
            $mdDialog.show({
                templateUrl : 'modules/admin/project/templates/modal/project-remove-modal.tpl.html',
                locals : {
                    project : $scope.project
                },
                controller : function($scope,project){
                    $scope.projectTitle = project.title;

                    $scope.delete = function(){
                        Project.delete(project._id).then(function(){
                            Notification.display(project.title+' successfully removed');
                            $state.go("home");
                        }).catch(function(err){
                            Notification.display('Error, the project was not removed');
                        }).finally(function(){
                            $mdDialog.hide();
                        });
                    };
                    $scope.cancel = function(){
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.updateProject=function() {
            Project.update($scope.project._id, $scope.project).then(function (result) {
                Notification.display('Updated');
            }).catch(function (err) {
                Notification.display(err.message);
            });
        };
    })
    .controller('ProjectMediaCtrl', function ($scope, Notification,Files,Url,Config) {
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
    })
    .controller('ProjectTeamCtrl', function ($scope,Project,Notification,$mdDialog, Profile) {   
        $scope.ban=function(userId){
            Project.banMember($scope.project._id, { member : userId }).then(function(result){
                Notification.display('Successfully removed');
                $scope.project.members.splice($scope.project.members.indexOf(userId),1);
            }).catch(function(err){
                Notification.display('Ban failed, please try again later');
            });
        };

        $scope.applyteams = [];
        function getApplications() { 
            return Project.getApply({container:$scope.project._id}).then(function(applyteams){
                $scope.applyteams = _.filter(applyteams, { status: false });
            }).catch(function(err){
                console.log(err);
            });
        }
        getApplications();

        $scope.finish=function($index,accepted){
            return Project.finishApply({status:true,accepted : accepted},  $scope.applyteams[$index]._id).then(function(data){
                return getApplications();
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

        $scope.rejectApplication = function($index){
            $scope.finish($index,false)
            .then(function() {
                Notification.display("Rejected application");
            });
        };

        $scope.acceptApplication=function(userId,$index){
            Project.addToTeam($scope.project._id,{userId : userId})
            .then(function(){
                return $scope.finish($index,true);
            }).then(function() {
                return Profile.getProfile(userId);
            }).then(function(profile) {
                $scope.project.members.push(profile.data);
                Notification.display("Accepted application");
            });
        };

        $scope.addTeamMember = function(user) {
            Project.addToTeam($scope.project._id,{userId : user._id})
            .then(function() {
                $scope.project.members.push(user);
                Notification.display("Accepted application");
            });
        };

        $scope.filterNewTeamMembers = function(user) {
            return user._id != $scope.project.owner._id && !_.chain($scope.project.members).pluck("_id").contains(user._id).value();
        };
    });