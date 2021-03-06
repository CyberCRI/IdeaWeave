angular.module('cri.auth',[
    'satellizer',
    'cri.common'
]).config(function($authProvider,ConfigProvider){
        var Config = ConfigProvider.$get();

        $authProvider.loginUrl = Config.apiServer+'/auth/login';
        $authProvider.signupUrl = Config.apiServer+'/auth/signup';
        $authProvider.signupRedirect = "/auth/signin";
        $authProvider.loginOnSignup = false;
        $authProvider.withCredentials = false;

        $authProvider.google({
            url: Config.apiServer+'/auth/google',
            clientId: Config.googleClient
        });

        $authProvider.github({
            url: Config.apiServer+'/auth/github',
            clientId: Config.githubClient
        });
    })
    .controller('LoginCtrl', function ($scope, Profile, $state,Notification,$auth,$mdDialog,$rootScope) {
        $scope.loader = {};
        $scope.authenticate = function(provider) {
            console.log('login with', provider);
            $scope.loader[provider] = true;
            $auth.authenticate(provider).then(Profile.getMe).then(function(me) {
                $rootScope.currentUser = me;
                if($rootScope.currentUser.email){
                    Notification.display("Welcome you're logged in");
                }else{
                    $mdDialog.show({
                        templateUrl : 'modules/auth/templates/modal/after-auth.tpl.html',
                        clickOutsideToClose : false,
                        escapeToClose : false,
                        locals : {
                            currentUser : $scope.currentUser
                        },
                        controller : function($scope,Profile,currentUser){
                            $scope.cancel = function(){
                                $mdDialog.hide();
                            };
                            $scope.updateProfile = function(){
                                $scope.profile = {
                                    username : $scope.currentUser.username,
                                    email : $scope.currentUser.email
                                };
                                Profile.update($rootScope.currentUser._id,$scope.profile).then(function(user){
                                    $rootScope.currentUser = user;
                                    $rootScope.$emit("changeLogin", user);
                                    Notification.display("Welcome, you're logged in");
                                    $mdDialog.hide();
                                }).catch(function(err){
                                    Notification.display("Error - you are not logged in");
                                });
                            };
                        }
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
            $auth.login({ email : $scope.signin.email, password : $scope.signin.password })
            .then(Profile.getMe)
            .then(function (me) {
                $rootScope.currentUser = me; 
                $rootScope.$emit("changeLogin", me);
                
                Notification.display("Welcome, you're logged in");
                $state.go('home');
            }).catch(function (err) {
                Notification.display(err.data && err.data.message || "An unknown error has occured");
            }).finally(function(){
                $scope.loader.email = false;
            });
        };
    })
    .controller('RegisterCtrl', ['$scope','$state','Notification','Gmap','Files','$auth',  function ($scope, $state, Notification,Gmap,Files,$auth) {
        $scope.rgform = {};

        $scope.check = {};

        $scope.signup = {
            tags: []
        };

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            });
        };

        $scope.registerUser = function (user) {
            if ($scope.check.password !== user.password) {
                Notification.display("The passwords do not match");
            } else {
                $auth.signup(user)
                .then(function() { 
                    Notification.display("Welcome, you can login now");
                    $state.go('signin');
                }).catch(function (err) {
                    Notification.display(err.data && err.data.message || "An unknown error has occured");
                });
            }
        };
    }])
    .controller('ForgotPasswordCtrl', function ($scope, $state, Profile, Notification) {
        $scope.email = "";

        $scope.send = function() {
            Profile.sendResetPasswordEmail($scope.email).then(function() {
                Notification.display("Verification token has been sent");
                $state.go("resetPassword", { email: $scope.email });
            }).catch(function(err) {
                console.error(err);
                Notification.display(err.message);
            });
        }
    })
    .controller('ResetPasswordCtrl', function ($scope, $state, $stateParams, Profile, Notification) {
        // Initialize inputs with URL parameters
        $scope.email = $stateParams.email || "";
        $scope.token = $stateParams.token || "";

        $scope.changePassword = function() {
            if($scope.newPassword !== $scope.newPasswordCheck) {
                return Notification.display("The passwords do not match");
            }

            Profile.resetPassword($scope.email, $scope.token, $scope.newPassword).then(function() {
                Notification.display("Password changed. Please login with your new password");
                $state.go("signin");
            }).catch(function(err) {
                console.error(err);
                Notification.display(err.message);
            });
        }

    });
