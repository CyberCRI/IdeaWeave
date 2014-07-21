'use strict';
angular.module('cri', [
    'ngSanitize',
    'ngAnimate',
    'ngMaterial',
    'ui.utils',
    'ui.router',
    'ui.ace',
    'ui.bootstrap',
    'ui.select',
    'ui.tinymce',
    'timer',
    'pascalprecht.translate',
    'angularFileUpload',
    'angular-carousel',
    'toaster',
    'scrollto',
//    'google-maps',
    'ImageCropper',
    'cri.config',
    'cri.home',
    'cri.header',
    'cri.footer',
	'cri.common',
    'cri.project',
    'cri.topic',
    'cri.account',
    'cri.challenge',
    'cri.challengeSettings',
    'cri.projectSetting',
    'cri.tag',
    'cri.user',
    'cri.admin',
    'cri.message'])
    .config(['$httpProvider','$locationProvider',function ($httpProvider,$locationProvider) {
        $httpProvider.defaults.withCredentials=true;
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }])
    .run(['users','loggedUser','$state', function (users,loggedUser,$state) {
        users.getMe();
    }])
    .controller('ToastCtrl',['$scope','$hideToast',function($scope, $hideToast) {
        $scope.closeToast = function() {
            $hideToast();
        };
    }]);


