angular.module('cri.account',[])
    .controller('LoginCtrl', ['$scope', 'users','$state','Notification', function ($scope, users, $state,Notification) {

        $scope.form = {};
        $scope.user = users;

        $scope.login = function ($event) {
            $event.preventDefault();
            users.login($scope.signin.username, $scope.signin.password)
                .then(function () {
                    Notification.display("welcome you're logged in");
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
    .controller('RegisterCtrl', ['$scope','users','$state','Notification','Gmap','Files','loggedUser',  function ($scope, users, $state, Notification,Gmap,Files,loggedUser) {

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
                users.register($scope.signup).then(function (result) {
                    Notification.display('Check your email to activate your account')
                }).catch(function(err){
                    Notification.display(err.message);
                })
            }
        };
    }])
    .controller('ActivateCtrl',['$scope','users','$state','$stateParams','Notification',function($scope,users,$state,$stateParams,Notification){
        $scope.activate = function(){
            users.update($stateParams.uid,{ emailValidated : true }).then(function(){
                $state.go('home')
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
    }]);
 
