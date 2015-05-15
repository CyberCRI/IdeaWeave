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
    'satellizer',
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
    'cri.message',
    'cri.project',
    'cri.workspace',
    'cri.auth',
    'cri.challenge',
    'cri.tag',
    'cri.profile',
    'cri.notes'])
    .config(['$httpProvider','$locationProvider','$sceProvider',function ($httpProvider,$locationProvider,$sceProvider) {
//        $httpProvider.defaults.withCredentials=true;
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $sceProvider.enabled(false);
//        dev

    }])
    .run(['Profile','mySocket','$rootScope','$auth', function (Profile,mySocket,$rootScope,$auth) {
        // If there is no user signed in by default, don't grab the profile which will end up redirecting to /login
        if(!$auth.getToken()) return;

        Profile.getMe().then(function(me){
            $rootScope.currentUser = me;
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
    }]).controller('RightNavCtrl',function($scope,$materialSidenav,$auth,Notification,$rootScope){
        var rightNav = $materialSidenav('right');
        $scope.sideNavTemplateUrl = "";

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
        $scope.signout = function() {
            $auth.logout();
            $rootScope.currentUser = null;
            rightNav.toggle();
            Notification.display('You have been logged out');
        }

        $scope.isOpen = function() {
            return rightNav.isOpen();
        }
    }).controller('LeftNavCtrl',function($scope,$materialSidenav,$state,Profile,Tag,Recommendation,$q,Project,Challenge){
        function getRecomendation(id){
            var defered = $q.defer();
            if(!$scope.currentUser) return defered.promise;

            $q.all([
                Recommendation.fetchUsers(id,$scope.currentUser.tags),
                Recommendation.fetchChallenges(id,$scope.currentUser.tags),
                Recommendation.fetchProjects(id,$scope.currentUser.tags)
            ]).then(function(recommendations){
                // console.log(recommendations)
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

        function getLeftNav() { 
            return $materialSidenav('left'); 
        }


        $scope.$watch(function(){
            return $state.params.uid;
        },function(){
            $scope.profile = Profile.data;
        });

        $scope.$watch(function(){
            return $state.params.cid;
        },function(){
            $scope.challenge = Challenge.data;
        });


        $scope.$watch(function(){
            return $state.params.pid;
        },function(){
            $scope.profile = Project.data;
        });


        $scope.$watch(function(){
            return $state.current.name;
        },function(state){
            // Clear the side nav by default, unless set later in this function
            $scope.sideNavTemplateUrl = "";

            switch(state){
                case 'profile':
                    getRecomendation(Profile.data._id).then(function(){
                        $scope.profile = Profile.data;
                        // TODO: put this back when profile sidebar is restored
                        //$scope.sideNavTemplateUrl = 'modules/common/leftNav/profile.tpl.html';
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
                    //$scope.sideNavTemplateUrl = 'modules/common/leftNav/admin-profile.tpl.html';
                    break;
                case 'challengeAdmin':
                    $scope.sideNavTemplateUrl = 'modules/common/leftNav/admin-challenges.tpl.html';
                    break;
                
                case 'project.home':
                case 'project.trello':
                case 'project.admin':
                case 'workspace':
                case 'workspace.hackpad':
                case 'workspace.files':
                case 'workspace.resources':
                    $scope.project = Project.data;

                    if($scope.currentUser){
                        if($scope.currentUser._id == Project.data.owner._id){
                            $scope.isOwner = true;
                            $scope.isMember = true;
                        } else{
                            angular.forEach(Project.data.members,function(member){
                                if(member._id == $scope.currentUser._id){
                                    $scope.isVisitor = false;
                                    $scope.isMember=true;
                                }
                            });
                        }
                    }
                    $scope.sideNavTemplateUrl = 'modules/common/leftNav/publications.tpl.html';

                    break;

            }
        });

        $scope.$on('toggleLeft',function(e){
            getLeftNav().toggle();
        });
        $scope.toggle = function(){
            getLeftNav().toggle();
        };
        $scope.$on('side:close-left',function(){
            getLeftNav().toggle();
        });
    }).controller('BodyCtrl', function($scope, $materialSidenav) {
        $scope.rightSidenavIsOpen = function() {
            return $materialSidenav('right').isOpen();
        }
    });
