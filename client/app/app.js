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
    'ImageCropper',
    'cri.admin',
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
    .run(['users','$window', function (users,$window) {
        users.getMe();
        $window.socket = io.connect('http://localhost:5011');
//        $window.socket = io.connect('http://ideastorm.io:5011');
    }])
    .controller('ToastCtrl',['$scope','$hideToast',function($scope, $hideToast) {
        $scope.closeToast = function() {
            $hideToast();
        };
    }]);


