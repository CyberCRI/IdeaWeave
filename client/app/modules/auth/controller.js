angular.module('cri.auth',[
    'satellizer',
    'cri.common'
]).config(function($authProvider,ConfigProvider){
        var Config = ConfigProvider.$get();

        $authProvider.loginUrl = Config.apiServer+'/auth/login';
        $authProvider.signupUrl = Config.apiServer+'/auth/signup';
        $authProvider.signupRedirect = "/auth/signin";
        $authProvider.loginOnSignup = false;

        $authProvider.google({
            url: Config.apiServer+'/auth/google',
            clientId: Config.googleClient
        });

        $authProvider.github({
            url: Config.apiServer+'/auth/github',
            clientId: Config.githubClient
        });
    })
    .controller('LoginCtrl', ['$scope', 'Profile','$state','Notification','$auth','$materialDialog','$rootScope','mySocket', function ($scope, Profile, $state,Notification,$auth,$materialDialog,$rootScope,mySocket) {
        $scope.loader = {};
        $scope.authenticate = function(provider) {
            console.log('login with', provider);
            $scope.loader[provider] = true;
            $auth.authenticate(provider).then(Profile.getMe).then(function(me) {
                $rootScope.currentUser = me;
                $rootScope.$broadcast('side:close-right');
                if($rootScope.currentUser.email){
                    Notification.display("Welcome you're logged in");
                }else{
                    $materialDialog({
                        templateUrl : 'modules/auth/templates/modal/after-auth.tpl.html',
                        clickOutsideToClose : false,
                        escapeToClose : false,
                        locals : {
                            currentUser : $scope.currentUser
                        },
                        controller : ['$scope','$hideDialog','Profile','currentUser',function($scope,$hideDialog,Profile,currentUser){
                            $scope.cancel = function(){
                                $hideDialog();
                            };
                            $scope.updateProfile = function(){
                                $scope.profile = {
                                    username : $scope.currentUser.username,
                                    email : $scope.currentUser.email
                                };
                                Profile.update($rootScope.currentUser._id,$scope.profile).then(function(user){
                                    $rootScope.currentUser = user;
                                    $hideDialog();
                                    Notification.display("Welcome, you're logged in");
                                }).catch(function(err){
                                    Notification.display("Error - you are not logged in");
                                });
                            };
                        }]
                    });
                }

            }).catch(function(err) {
                console.log("error",err);
            }).finally(function(){
                $scope.loader[provider] = false;
            });
        };

        $scope.form = {};

        $scope.login = function ($event) {
            $event.preventDefault();
            if(!$scope.signin) return false; // Can occur if the form is empty

            $scope.loader.email = true;
            $auth.login({ email : $scope.signin.email, password : $scope.signin.password }).then(Profile.getMe).then(function (me) {
                $rootScope.currentUser = me; 
                
                Notification.display("Welcome, you're logged in");
                $scope.signin = {};
                $state.go('home');
                mySocket.init($scope.currentUser);
                $scope.$emit('side:close-right');
            }).catch(function (err) {
                Notification.display(err.data && err.data.message || "An unknown error has occured");
            }).finally(function(){
                $scope.loader.email = false;
            });
        };

        $scope.resetPassForm = false;
        $scope.forgotPass = function(){
            $scope.resetPassForm = !$scope.resetPassForm;
        };

        $scope.resetF = {};
        $scope.getToken = function (email) {
            if(!$scope.emailSend){
                Profile.getResetPassToken(email).then(function(data){
                    if (data.error) {
                        Notification.display('Sorry, an error occured.');

                    } else {
                        $scope.emailSend = true;
                        Notification.display("Verification code has been sent successfully, please log in to view your mailbox");

                    }
                });
            }

        };
        $scope.reSet = function (resetData) {
            Profile.resetPassword(resetData).then(function (data) {
                if (data.error) {
                    Notification.display('Sorry, an error occured.');
                } else {
                    Notification.display('Password reset successfull');
                }
            });
        };

    }])
    .controller('RegisterCtrl', ['$scope','$state','Notification','Gmap','Files','$auth',  function ($scope, $state, Notification,Gmap,Files,$auth) {

        $scope.rgform = {};

        $scope.check = {};

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            });
        };

        $scope.registerUser = function (user) {
            if ($scope.check.password !== user.password) {
                Notification.display("The passwords do not match");
            } else {
                $auth.signup(user);
                Notification.display("Welcome, you can login now");
                $state.go('signin');
            }
        };

    }])
    .controller('ActivateCtrl',['$scope','Profile','$state','$stateParams','Notification',function($scope,Profile,$state,$stateParams,Notification){
        $scope.activate = function(){
            Profile.update($stateParams.uid,{ emailValidated : true }).then(function(){
                $state.go('home');
            }).catch(function(err){
                Notification.display(err.message);
            });
        };
    }]);