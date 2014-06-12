angular.module('cri.account',[])
    .controller('LoginCtrl', ['$scope', 'users','$state','toaster' ,function ($scope, users, $state,toaster) {
        console.log('loginCtrl')
        $scope.form = {};
        $scope.user = users;
        $scope.login = function () {
            users.login($scope.form.username, $scope.form.password)
                .then(function () {
                    toaster.pop('success', 'Welcome', 'You are logged in !!!');
                    $state.go('challenges');
                })
                .catch(function (err) {
                    console.log(err)
                    toaster.pop('error', err.status, err.message);
                });
        };
    }])
    .controller('RegisterCtrl', ['$scope','users','$state','toaster','Gmap','Files','loggedUser',  function ($scope, users, $state, toaster,Gmap,Files,loggedUser) {

        $scope.user = users;

        $scope.rgform = {};

        $scope.check = {};

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            })
        };

        $scope.ok = function(){
            $scope.fileUploadQuestion = false;
            $scope.showFileUploader = true;
        }

        $scope.cancel = function(){
            $state.go('challenges');
        }

        $scope.registerUser = function () {
            //$scope.isSending = true;
            console.log($scope)
            if ($scope.check.password !== $scope.rgform.password) {
                $scope.notMatch = true;
            } else {
                $scope.notMatch = false;
                users.register($scope.rgform).then( function (result) {
                    $scope.fileUploadQuestion = true;
                    toaster.pop('info','success','If you want you can set up a profile picture rigth now')
                },function(err){
                    toaster.pop('error',err.status, err.message);
                })
            }
        };

        $scope.fileSelected = function($files){
            $scope.file = $files[0];
            console.log($scope.file)
            if(Files.isImage($scope.file)){
                Files.getDataUrl($scope.file).then(function(dataUrl){
                    $scope.fileUrl = dataUrl;
                })
                $scope.dropBoxHeight = "300px";
            }else{
                toaster.pop('warning','warning','this file is not an image');
            }
        }


        $scope.cancelUpload = function(){
            $scope.file = null;
            $scope.fileUrl = null;
            $scope.dropBoxHeight = "100px";
        }

        $scope.upload = function(topic,file,description){
            users.uploadPoster(file).then(function(data){
                toaster.pop('success','upload success','your file has been uploaded !!!');
                $scope.file = null;
                $scope.fileUrl = null;
                $scope.dropBoxHeight = "100px";
                $state.go('userSettings.basic',{ uid : loggedUser.profile.id });
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])
    .controller('resetPassCtrl', ['$scope', '$stateParams', 'users', '$state', 'toaster', function ($scope, $stateParams, users, $state, toaster) {
        $scope.resetF = {};
        $scope.getToken = function () {
            users.getResetPassToken($scope.resetF.checkEmail).then(function(data){
                if (data.error) {
                    toaster.pop('error','error', 'an error occured sorry.')
//                    $scope.notifyErr = data.error;
                } else {
                    toaster.pop('sucess','success',"Verification code has been sent successfully, please log in to view your mailbox")
//                    $scope.notifyMsg = "Verification code has been sent successfully, please log in to view your mailbox";
                }
            })
//            jzCommon.postOj(apiServer + '/datas/resetPass/' + $scope.resetF.checkEmail).then(function (data) {
//                if (data.error) {
//                    $scope.notifyErr = data.error;
//                } else {
//                    $scope.notifyMsg = "Verification code has been sent successfully, please log in to view your mailbox";
//                }
//            })
        }
        $scope.reSet = function () {
            users.resetPassword($scope.resetF).then(function (data) {
                if (data.error) {
                    alert(data.error);
                    toaster.pop('error','error','an error occured sorry');
                } else {
                    toaster.pop('success','success','Password reset successfull');
//                    alert('Reset success！');
                    $state.go('login');
                }
            })
//            jzCommon.postOj(apiServer + '/datas/reset/', $scope.resetF).then(function (data) {
//                if (data.error) {
//                    alert(data.error);
//                } else {
//                    alert('Reset success！');
//                    $location.path('account/login');
//                }
//            })
        }

    }]);
 
