angular.module('cri.admin.challenge',[])
    .controller('AdminChallengeCtrl',['$scope','challenge','Challenge','Notification','$materialDialog','Project','$materialSidenav',function($scope,challenge,Challenge,Notification,$materialDialog,Project,$materialSidenav){
        $scope.challenge = challenge[0];
        $scope.templates = [];
        var leftNav;
        $scope.toggle = function(){
            leftNav.toggle();
        };

        $scope.$on('showAdmin',function(){
            leftNav = $materialSidenav('left');
            leftNav.toggle();
        });

        Project.getByChallenge($scope.challenge._id).then(function(data){
           $scope.projects = data;
        }).catch(function(err){
            console.log(err);
        });

        Challenge.getTemplates( $scope.challenge._id).then(function(data){
            $scope.templates = data;
        }).catch(function(err){
            console.log(err);
        });

        $scope.popUpTemplate = function($event){
            $materialDialog({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-template-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    challenge : $scope.challenge,
                    templates : $scope.templates
                },
                controller : ['$scope','$hideDialog','challenge','templates','Config',function($scope,$hideDialog,challenge,templates,Config){
                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.createTemplate = function(newTemplate){
                        newTemplate.challenge = challenge._id;
                        Challenge.createTemplate(challenge._id,newTemplate).then(function(data){
                           templates.push(data);
                           Notification.display('Template created');
                        }).catch(function(err){
                            Notification.display('error template');
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


        $scope.popUpPoster = function($event){
            $materialDialog({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-crop-poster-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    challenge : $scope.challenge
                },
                controller : ['$scope','$hideDialog','challenge',function($scope,$hideDialog,challenge){
                    $scope.imageCropResult = null;
                    $scope.$watch('imageCropResult',function(dataUri,e){
                        if(dataUri){
                            var newChallenge = {
                                poster : dataUri
                            };
                            Challenge.update(challenge._id,newChallenge).then(function(data){
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
                    challenge : $scope.challenge
                },
                controller : ['$scope','$hideDialog','challenge',function($scope,$hideDialog,challenge){
                    $scope.imageCropResult = null;
                    $scope.$watch('imageCropResult',function(dataUri,e){
                        if(dataUri){
                            var newChallenge = {
                                banner : dataUri
                            };
                            Challenge.update(challenge._id,newChallenge).then(function(data){
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
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-edit-modal.tpl.html',
                locals : {
                    challenge : $scope.challenge
                },
                controller : ['$scope','$hideDialog','challenge','Config',function($scope,$hideDialog,challenge,Config){
                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.newChallenge = {};
                    $scope.newChallenge.brief = challenge.brief;
                    $scope.update = function(newChallenge){
                        $scope.isLoading = true;
                        Challenge.update(challenge._id,newChallenge).then(function(data){
                            Notification.display('Updated successfully');
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
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-remove-modal.tpl.html',
                locals : {
                    challenge : $scope.challenge
                },
                controller : ['$scope','$hideDialog','challenge',function($scope,$hideDialog,challenge){

                    $scope.delete = function(test){
                        if(test.title == challenge.title){
                            Challenge.remove(challenge._id).then(function(){
                                Notification.display(challenge.title+' succesly removed');
                            }).catch(function(err){
                                Notification.display('error, the challenge is not removed');
                            }).finally(function(){
                                $hideDialog();
                            });
                        }
                    };
                    $scope.cancel = function(){
                        $hideDialog();
                    };
                }]

            });
        };


        $scope.updateChallenge=function(){
            $scope.isBasicLoading = true;
            var data = {
                title : $scope.challenge.title,
                tags : $scope.challenge.tags
            };
            Challenge.update($scope.challenge.id,data).then(function(){
                Notification.display('Challenge updated');
            }).catch(function(err){
                Notification.display(err.message);
            }).finally(function(){
                $scope.isBasicLoading = false;
            });
        };
    }]);