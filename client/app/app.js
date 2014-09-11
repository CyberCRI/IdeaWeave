'use strict';
angular.module('cri', [
    'templates',
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
    'cri.d3',
    'cri.files',
    'cri.home',
    'cri.header',
    'cri.footer',
	'cri.common',
    'cri.project',
    'cri.noteLab',
    'cri.auth',
    'cri.challenge',
    'cri.challengeSettings',
    'cri.tag',
    'cri.user',
    'cri.message'])
    .config(['$httpProvider','$locationProvider','$authProvider',function ($httpProvider,$locationProvider,$authProvider) {
//        $httpProvider.defaults.withCredentials=true;
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

//        dev

    }])
    .run(['users','mySocket','$rootScope', function (users,mySocket,$rootScope) {
        users.getMe().then(function(me){
            console.log('data',me);
//            $rootScope.currentUser = me;
            mySocket.init(me);
            users.getPoster(me._id).then(function(data){
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
    }]);
angular.module('templates',[]);