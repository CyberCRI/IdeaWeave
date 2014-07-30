angular.module('cri.account',[])
    .controller('LoginCtrl', ['$scope', 'users','$state','Notification', function ($scope, users, $state,Notification) {

        $scope.form = {};
        $scope.user = users;

        $scope.login = function ($event) {
            $event.preventDefault();
            users.login($scope.signin.username, $scope.signin.password)
                .then(function () {
                    Notification.display('welcome you(re logged in');
                    $state.go('home');
                    $scope.$emit('side:close-right');
                })
                .catch(function (err) {
                    console.log(err);
                    Notification.display(err.message);
//                    toaster.pop('error', err.status, err.message);
                });
        };

        $scope.resetPassForm = false;
        $scope.forgotPass = function(){
            $scope.resetPassForm = !$scope.resetPassForm;
        }

        $scope.resetF = {};
        $scope.getToken = function (email) {
            if(!$scope.emailSend){
                users.getResetPassToken(email).then(function(data){
                    if (data.error) {
                        Notification.display('an error occured sorry.');
//                        toaster.pop('error','error', 'an error occured sorry.')
//                    $scope.notifyErr = data.error;
                    } else {
                        $scope.emailSend = true;
                        Notification.display("Verification code has been sent successfully, please log in to view your mailbox");
//                        toaster.pop('sucess','success',"Verification code has been sent successfully, please log in to view your mailbox");
//                    $scope.notifyMsg = "Verification code has been sent successfully, please log in to view your mailbox";
                    }
                })
            }

        }
        $scope.reSet = function (resetData) {
            users.resetPassword(resetData).then(function (data) {
                if (data.error) {
                    Notification.display('an error occured sorry.');
//                    toaster.pop('error','error','an error occured sorry');
                } else {
                    Notification.display('Password reset successfull');
                }
            })
        }

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
        };

        $scope.cancel = function(){
            $state.go('challenges');
        };

        $scope.registerUser = function ($event) {
            $event.preventDefault();
            if ($scope.check.password !== $scope.signup.password) {
                $scope.notMatch = true;
            } else {
                $scope.notMatch = false;
                console.log($scope.signup);
                users.register($scope.signup).then( function (result) {
//                    $scope.fileUploadQuestion = true;
//                    toaster.pop('info','success','If you want you can set up a profile picture rigth now')
                    toaster.pop('info','Activation','Check your email to activate your account')

                },function(err){
                    toaster.pop('error',err.status, err.message);
                })
            }
        };

        $scope.fileSelected = function($files){
            $scope.file = $files[0];
            if(Files.isImage($scope.file)){
                Files.getDataUrl($scope.file).then(function(dataUrl){
                    $scope.fileUrl = dataUrl;
                })
                $scope.dropBoxHeight = "300px";
            }else{
                toaster.pop('warning','warning','this file is not an image');
            }
        };


        $scope.cancelUpload = function(){
            $scope.file = null;
            $scope.fileUrl = null;
            $scope.dropBoxHeight = "100px";
        };

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
    .controller('ActivateCtrl',['$scope','users','$state','$stateParams','toaster',function($scope,users,$state,$stateParams,toaster){
        $scope.activate = function(){
            users.update($stateParams.uid,{ emailValidated : true }).then(function(){
                $state.go('home')
            }).catch(function(err){
                toaster.pop('error',err.status,err.message)
            })
        }
    }])
 