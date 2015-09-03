angular.module('cri.admin.profile',['cri.profile'])
    .controller('AdminProfileCtrl', function ($scope,$state,$rootScope,Profile,Gmap,Notification,$mdDialog) {
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
                $mdDialog.show({
                    templateUrl : 'modules/admin/profile/templates/modal/cropPosterModal.tpl.html',
                    clickOutsideToClose : false,
                    escapeToClose : false,
                    locals : {
                        currentUser : $scope.currentUser
                    },
                    controller : function($scope,Profile,currentUser){
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

            $scope.editPageModal = function(){
                $mdDialog.show({
                    templateUrl : 'modules/admin/profile/templates/modal/editPageModal.tpl.html',
                    locals : {
                        currentUser: $scope.currentUser,
                        profile: $scope.profile
                    },
                    controller : function($scope,Config,Profile,currentUser, profile) {
                        $scope.brief = profile.brief;

                        $scope.tinymceOption = Config.tinymceOptions;
                        $scope.cancel = function(){
                            $mdDialog.hide();
                        };
                        $scope.updateProfile=function(){
                            profile.brief = $scope.brief;
                            Profile.update(currentUser._id, profile).then(function(data){
                                Notification.display('Updated successfully');
                                $state.go('profile',{ uid : currentUser._id });
                            }).catch(function(err){
                                Notification.display(err.message);
                            }).finally(function(){
                                $mdDialog.hide();
                            });
                        };
                    }
                });
            };

            $scope.resetPassModal = function(){
                $mdDialog.show({
                    templateUrl : 'modules/admin/profile/templates/modal/resetPassword.tpl.html',
                    locals : {
                        currentUser : $scope.currentUser
                    },
                    controller : function($scope,Profile,currentUser){
                        $scope.passwordInfo = {
                            currentPassword: "",
                            newPassword: "",
                            newPassword2: ""
                        };

                        $scope.cancel = function(){
                            $mdDialog.hide();
                        };

                        $scope.updatePass=function(){
                            if($scope.passwordInfo.newPassword!=$scope.passwordInfo.newPassword2){
                                Notification.display("The new passwords fields don't match");
                            }else{
                                Profile.resetPassword($scope.passwordInfo).then(function(result){
                                    Notification.display('Updated successfully');
                                    $mdDialog.hide();
                                }).catch(function(err){
                                    Notification.display(err.message);
                                });
                            }
                        };
                    }
                });
            };

            $scope.updateProfile=function(){
                Profile.update($scope.currentUser._id, $scope.profile).then(function(data){
                    Notification.display('Updated successfully');
                    $rootScope.currentUser = data; // update the current user
                    $state.go('profile',{ uid : $scope.currentUser._id });
                }).catch(function(err){
                    Notification.display(err.message);
                });
            };
        });
    });