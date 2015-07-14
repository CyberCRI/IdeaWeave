angular.module('cri.admin.profile',['cri.profile'])
    .controller('AdminProfileCtrl',['$scope','$rootScope','Profile','Gmap','Notification','$materialDialog',function ($scope,$rootScope,Profile,Gmap,Notification,$materialDialog) {
        Profile.getMe().then(function(me) {
            $scope.profile = me;
            delete $scope.profile._id;
            delete $scope.profile.poster;
            _.defaults($scope.profile, {
                tags: [],
                localisation: []
            });

            $scope.refreshAddresses = function(address) {
                Gmap.getAdress(address).then(function(adresses){
                    $scope.addresses = adresses;
                });
            };

            $scope.cropPosterModal = function($event){
                $materialDialog({
                    templateUrl : 'modules/admin/profile/templates/modal/cropPosterModal.tpl.html',
                    clickOutsideToClose : false,
                    escapeToClose : false,
                    locals : {
                        currentUser : $scope.currentUser
                    },
                    controller : ['$scope','Profile','$hideDialog','currentUser',function($scope,Profile,$hideDialog,currentUser){
                        $scope.imageCropResult = null;
                        $scope.$watch('imageCropResult',function(dataUri){
                            if(dataUri){
                                var user = {
                                    poster : dataUri
                                };
                                Profile.update(currentUser._id,user).then(function(data){
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

            $scope.editPageModal = function(){
                $materialDialog({
                    templateUrl : 'modules/admin/profile/templates/modal/editPageModal.tpl.html',
                    locals : {
                        currentUser: $scope.currentUser,
                        profile: $scope.profile
                    },
                    controller : function($scope,Config,Profile,$hideDialog,currentUser, profile) {
                        $scope.brief = profile.brief;

                        $scope.tinymceOption = Config.tinymceOptions;
                        $scope.cancel = function(){
                            $hideDialog();
                        };
                        $scope.updateProfile=function(){
                            profile.brief = $scope.brief;
                            Profile.update(currentUser._id, profile).then(function(data){
                                Notification.display('Updated successfully');
                            }).catch(function(err){
                                Notification.display(err.message);
                            }).finally(function(){
                                $hideDialog();
                            });
                        };
                    }
                });
            };

            $scope.resetPassModal = function(){
                $materialDialog({
                    templateUrl : 'modules/admin/profile/templates/modal/resetPassword.tpl.html',
                    locals : {
                        currentUser : $scope.currentUser
                    },
                    controller : ['$scope','Profile','$hideDialog','currentUser',function($scope,Profile,$hideDialog,currentUser){
                        $scope.passwordInfo = {
                            currentPassword: "",
                            newPassword: "",
                            newPassword2: ""
                        };

                        $scope.cancel = function(){
                            $hideDialog();
                        };

                        $scope.updatePass=function(){
                            if($scope.passwordInfo.newPassword!=$scope.passwordInfo.newPassword2){
                                Notification.display("The new passwords fields don't match");
                            }else{
                                Profile.resetPassword($scope.passwordInfo).then(function(result){
                                    Notification.display('Updated successfully');
                                    $hideDialog();
                                }).catch(function(err){
                                    Notification.display(err.message);
                                });
                            }
                        };

                    }]
                });
            };

            $scope.updateProfile=function(){
                Profile.update($scope.currentUser._id, $scope.profile).then(function(data){
                    Notification.display('Updated successfully');
                    $rootScope.currentUser = data; // update the current user 
                }).catch(function(err){
                    Notification.display(err.message);
                });
            };
        });
    }]);