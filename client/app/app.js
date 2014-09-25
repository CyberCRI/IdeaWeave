'use strict';
angular.module('cri', [
    'ngSanitize',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
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
    'cri.profile'])
    .config(['$httpProvider','$locationProvider','$sceProvider',function ($httpProvider,$locationProvider,$sceProvider) {
//        $httpProvider.defaults.withCredentials=true;
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $sceProvider.enabled(false);
//        dev

    }])
    .run(['Profile','mySocket','$rootScope', function (Profile,mySocket,$rootScope) {
        Profile.getMe().then(function(me){
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
    }).controller('LeftNavCtrl',function($scope,$materialSidenav,$state,Profile,Tag,Recommendation,$q){
        function getRecomendation(){
            var defered = $q.defer();
            $q.all([
                Recommendation.fetchUsers($scope.currentUser._id,$scope.currentUser.tags,'user'),
                Recommendation.fetchChallenges($scope.currentUser._id,$scope.currentUser.tags,'user'),
                Recommendation.fetchProjects($scope.currentUser._id,$scope.currentUser.tags,'user')
            ]).then(function(recommendations){
                if(recommendations[0].length > 0){
                    $scope.recommandedUsers = recommendations[0];
                }
                if(recommendations[2].length > 0){
                    $scope.recommandedProjects = recommendations[2];
                }
                if(recommendations[1].length > 0){
                    $scope.recommandedChallenges = recommendations[1];
                }
                defered.resolve();
            }).catch(function(err){
                defered.reject(err);
            });
            return defered.promise;
        }

        function getTags(){
            var defered = $q.defer();
            Tag.fetch().then(function(tags) {
                $scope.tags = tags;
                defered.resolve();
            }).catch(function(err){
                defered.reject(err)
                console.log(err);
            });
            return defered.promise;
        }

        console.log($state)
        $scope.$watch(function(){
            return $state.params.uid;
        },function(){
            $scope.profile = Profile.data;
        });

        $scope.$watch(function(){
            return $state.current.name;
        },function(state){
            console.log(state)
            switch(state){
                case 'profile':
                   getRecomendation().then(function(){
                       $scope.profile = Profile.data;
                       $scope.sideNavTemplateUrl = 'modules/common/leftNav/profile.tpl.html';
                   });
                    break;
                case 'projects.list':
                    getTags().then(function(){
                        $scope.sideNavTemplateUrl = 'modules/common/leftNav/tags-projects.tpl.html';
                    });
                    break;
                case 'challenges.list':
                    getTags().then(function(){
                        $scope.sideNavTemplateUrl = 'modules/common/leftNav/tags-challenges.tpl.html';
                    });
                    break;
                case 'profileAdmin':

                    break;
                case 'projectAdmin':

                    break;
                case 'challengeAdmin':

                    break;
            }
        });
//
        var leftNav = $materialSidenav('left');
        $scope.$on('toggleLeft',function(e){
            leftNav.toggle();
        });
        $scope.toggle = function(){
            leftNav.toggle();
        };
        $scope.$on('side:close-left',function(){
            leftNav.toggle();
        });
    }).controller('MainCtrl',function($scope,$state){
        $scope.leftNav = true;
        $scope.$watch(function(){
            return $state.current.name;
        },function(state){
            switch(state){
                case 'home':
                    $scope.leftNav = false;
                    break;
                case 'workspace':
                    $scope.leftNav = false;
                    break;
                case 'workspace.note.discussion':
                    $scope.leftNav = false;
                    break;
                case 'workspace.note.file':
                    $scope.leftNav = false;
                    break;
                case 'workspace.note.resources':
                    $scope.leftNav = false;
                    break;
                case 'workspace.note.hackpad':
                    $scope.leftNav = false;
                    break;
                default :
                    $scope.leftNav = true;
                    break;
            }
        })
    });
