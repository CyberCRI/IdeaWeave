'use strict';
angular.module('cri', [
    'ngSanitize',
    'ngAnimate',
    'ngMaterial',
    'ui.utils',
    'ui.router',
    'ui.select',
    'ui.tinymce',
    'timer',
    'pascalprecht.translate',
    'angularFileUpload',
    'angular-carousel',
    'ImageCropper',
    'Satellizer',
    'btford.socket-io',
    'yaru22.angular-timeago',
    'cri.admin',
    'cri.d3',
    'cri.hackpad',
    'cri.files',
    'cri.home',
    'cri.header',
    'cri.footer',
	'cri.common',
    'cri.project',
    'cri.workspace',
    'cri.auth',
    'cri.challenge',
    'cri.tag',
    'cri.profile',
    'cri.message'])
    .config(['$httpProvider','$locationProvider','$sceProvider',function ($httpProvider,$locationProvider,$sceProvider) {
//        $httpProvider.defaults.withCredentials=true;
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $sceProvider.enabled(false);
//        dev

    }])
    .run(['Profile','mySocket','$rootScope', function (Profile,mySocket,$rootScope) {
        Profile.getMe().then(function(me){
            console.log('data',me);
//            $rootScope.currentUser = me;
            mySocket.init(me);
            Profile.getPoster(me._id).then(function(data){
                $rootScope.currentUser.poster = data.poster;
            }).catch(function(err){
                console.log('poster error',err)
            })
        }).catch(function(err){
            console.log('err',err)
        });
    }])
    .controller('ToastCtrl',['$scope','$hideToast',function($scope, $hideToast) {
        $scope.closeToast = function() {
            $hideToast();
        };
    }]).controller('RightNavCtrl',function($scope,$materialSidenav,$auth,Notification){
        var rightNav = $materialSidenav('right');
        $scope.$on('toggleRight',function(e,type){
            switch(type){
                case 'login':
                    $scope.sideNavTemplateUrl = 'modules/auth/templates/signin.tpl.html';
                    rightNav.toggle();
                    break;
                case 'menu':
                    $scope.sideNavTemplateUrl = 'modules/header/templates/menu.tpl.html';
                    rightNav.toggle();
                    break;
            }

        });
        $scope.toggleRight = function(){
            rightNav.toggle();
        };
        $scope.$on('showLogin',function(){
            rightNav.toggle();
        });
        $scope.$on('side:close-right',function(){
            rightNav.toggle();
        });
        $scope.signout =function() {
            $auth.logout();
            rightNav.toggle();
            Notification.display('You have been logged out');
        }
    });
