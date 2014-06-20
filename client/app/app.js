'use strict';
angular.module('cri', [
    'ngSanitize',
    'ngAnimate',
    'ui.utils',
    'ui.router',
    'ui.ace',
    'ui.bootstrap',
    'ui.select',
    'ui.tinymce',
    'pascalprecht.translate',
    'btford.socket-io',
    'angularFileUpload',
    'toaster',
    'google-maps',
    'duParallax',
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
    'cri.admin'])
    .config(['$httpProvider','$locationProvider',function ($httpProvider,$locationProvider) {
        $httpProvider.defaults.withCredentials=true;
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }])
    .run(['users', function (users) {
        users.getMe();
    }]);
