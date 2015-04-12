angular.module('cri.admin.challenge',[])
    .controller('ChallengeAdminLeftCtrl',function($scope,$materialDialog,$state,Challenge,Notification,NoteLab){

        $scope.popUpPoster = function($event){
            $materialDialog({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-crop-poster-modal.tpl.html',
                escapeToClose : false,
                clickOutsideToClose : false,
                locals : {
                    challenge : Challenge.data
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
                    challenge : Challenge.data
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
                    challenge : Challenge.data
                },
                controller : ['$scope','$hideDialog','challenge','Config',function($scope,$hideDialog,challenge,Config){
                    $scope.tinymceOption = Config.tinymceOptions;
                    $scope.newChallenge = {};
                    $scope.newChallenge.home = challenge.home;
                    $scope.update = function(newChallenge){
                        $scope.isLoading = true;
                        Challenge.update(challenge._id,newChallenge).then(function(data){
                            Notification.display('Updated successfully');
                            Challenge.data = data; // Update the challenge locally so that the next edit will take it into account
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

        $scope.popUpNewNote = function(){
            $materialDialog({
                templateUrl : 'modules/admin/challenge/templates/modal/challenge-add-note-modal.tpl.html',
                locals : {
                    challenge : Challenge.data
                },
                controller : ['$scope','$hideDialog','challenge','Config',function($scope,$hideDialog,challenge,Config){
                    $scope.tinymceOption = Config.tinymceOptions;

                    $scope.noteText = "";
                    $scope.addNote = function(noteText){
                        $scope.isLoading = true;

                        var note = {
                            challenge: challenge._id,
                            text: noteText
                        };

                        NoteLab.createNote(note).then(function(data){
                            Notification.display('Posted successfully');
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
                    challenge : Challenge.data
                },
                controller : ['$scope','$hideDialog','challenge',function($scope,$hideDialog,challenge){
                    $scope.challengeTitle = challenge.title

                    $scope.delete = function(){
                        Challenge.remove(challenge._id).then(function(){
                            Notification.display(challenge.title+' successfully removed');
                            $state.go("home");
                        }).catch(function(err){
                            Notification.display('Error, the challenge was not removed');
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
    })
    .controller('AdminChallengeCtrl',['$scope','challenge','Challenge','Notification','$materialDialog','Project','$rootScope',function($scope,challenge,Challenge,Notification,$materialDialog,Project,$rootScope){
        $scope.challenge = challenge[0];
        $scope.templates = [];
        $scope.toggleLeft = function(){
            $rootScope.$broadcast('toggleLeft');
        };

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

        $scope.updateChallenge=function(){
            $scope.isBasicLoading = true;
            var data = {
                title: $scope.challenge.title,
                tags: _.pluck($scope.challenge.tags, "_id"), // Just take the IDs of tags
                brief: $scope.challenge.brief
            };
            Challenge.update($scope.challenge._id,data).then(function(){
                Notification.display('Challenge updated');
            }).catch(function(err){
                Notification.display(err.message);
            }).finally(function(){
                $scope.isBasicLoading = false;
            });
        };
    }]);