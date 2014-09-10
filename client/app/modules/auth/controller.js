angular.module('cri.auth',[])
    .controller('LoginCtrl', ['$scope', 'users','$state','Notification','$auth','$materialDialog','$rootScope','mySocket', function ($scope, users, $state,Notification,$auth,$materialDialog,$rootScope,mySocket) {

        var currentUser = $scope.currentUser;
        $scope.loader = {}
        $scope.authenticate = function(provider) {
            $scope.loader[provider] = true;
            $auth.authenticate(provider).then(function(user) {
                $rootScope.$broadcast('side:close-right');
                if(user.email){
                    Notification.display("Welcome you're logged in");
                }else{
                    $materialDialog({
                        templateUrl : 'modules/auth/templates/modal/after-auth.tpl.html',
                        clickOutsideToClose : false,
                        escapeToClose : false,
                        controller : ['$scope','$hideDialog','users',function($scope,$hideDialog,users){
                            $scope.cancel = function(){
                                $hideDialog();
                            };
                            $scope.updateProfile = function(){
                                $scope.profile = {
                                    username : $scope.currentUser.username,
                                    email : $scope.currentUser.email
                                };
                                users.update(user._id,$scope.profile).then(function(user){
                                    currentUser = user;
                                    $hideDialog();
                                    Notification.display("Welcome you're logged in");
                                }).catch(function(err){
                                    Notification.display("error you are not logged in");
                                })
                            };
                        }]
                    })
                }

            }).catch(function(err) {
                console.log("error",err)
            }).finally(function(){
                $scope.loader[provider] = false;
            })
        };

        $scope.form = {};
        $scope.user = users;

        $scope.login = function ($event) {
            $event.preventDefault();
            $scope.loader['email'] = true;
            $auth.login({ email : $scope.signin.email, password : $scope.signin.password }).then(function () {
                Notification.display("welcome you're logged in");
                $scope.signin = {};
                $state.go('home');
                mySocket.init($scope.currentUser);
                $scope.$emit('side:close-right');
            }).catch(function (err) {
                Notification.display(err.message);
            }).finally(function(){
                $scope.loader['email'] = false;
            })
        };

        $scope.resetPassForm = false;
        $scope.forgotPass = function(){
            $scope.resetPassForm = !$scope.resetPassForm;
        };

        $scope.resetF = {};
        $scope.getToken = function (email) {
            if(!$scope.emailSend){
                users.getResetPassToken(email).then(function(data){
                    if (data.error) {
                        Notification.display('an error occured sorry.');

                    } else {
                        $scope.emailSend = true;
                        Notification.display("Verification code has been sent successfully, please log in to view your mailbox");

                    }
                })
            }

        };
        $scope.reSet = function (resetData) {
            users.resetPassword(resetData).then(function (data) {
                if (data.error) {
                    Notification.display('an error occured sorry.');
                } else {
                    Notification.display('Password reset successfull');
                }
            })
        }

    }])
    .controller('RegisterCtrl', ['$scope','$state','Notification','Gmap','Files','$auth',  function ($scope, $state, Notification,Gmap,Files,$auth) {

        $scope.rgform = {};

        $scope.check = {};

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            })
        };


        $scope.cancel = function(){
            $state.go('challenges');
        };
        $scope.registerUser = function (user) {
            if ($scope.check.password !== user.password) {
                $scope.notMatch = true;
            } else {
                $scope.notMatch = false;
                $auth.signup(user).then(function (result) {
                    Notification.display("Welcome, you can login now, don't forget to activate your email later");
                    $scope.$emit('showLogin');
//                    Notification.display('Check your email to activate your account')
                }).catch(function(err){
                    if(err.errors.username){
                        Notification.display('username already taken');
                    }else if(err.errors.email){
                        Notification.display('email already taken');
                    }else{
                        Notification.display(err.message);
                    }
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
 
