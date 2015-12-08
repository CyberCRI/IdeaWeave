'use strict';
angular.module('cri', [
    'ngSanitize',
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ui.router',
    'ui.select',
    'ui.tinymce',
    'timer',
    'pascalprecht.translate',
    'ngFileUpload',
    'angular-carousel',
    'ImageCropper',
    'satellizer',
    'btford.socket-io',
    'yaru22.angular-timeago',
    'cri.admin',
    'cri.badge',
    'cri.d3',
    'cri.etherpad',
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
    'angulartics', 
    'angulartics.google.analytics',
    'cri.notes',
    'cri.idea',
    'cri.search',
    'ngCookies'])
    .config(['$httpProvider','$locationProvider','$sceProvider',function ($httpProvider,$locationProvider,$sceProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $sceProvider.enabled(false);
    }])
    .run(function (Profile,$rootScope,$auth) {
        // If there is no user signed in by default, don't grab the profile which will end up redirecting to /login
        if(!$auth.getToken()) return;

        Profile.getMe().then(function(me){
            $rootScope.currentUser = me;
            $rootScope.$emit("changeLogin", me);
        }).catch(function(err){
            console.log('err',err)
        });
    })
    .run(function($rootScope, mySocket) {
        // Update socket when login changes
        function updateSocket() {
            if($rootScope.currentUser) {
                mySocket.init($rootScope.currentUser);
            } else {
                mySocket.disconnect();
            }
        } 

        $rootScope.$on("changeLogin", updateSocket);
    })
    // Keep track of the unseen notifications 
    .run(function($rootScope, Profile) {
        function updateNotificationCounter() {
            $rootScope.unseenNotificationCounter = 0;

            if($rootScope.currentUser) {
                Profile.getUnseenNotificationCounter().then(function(data) {
                    $rootScope.unseenNotificationCounter = data.unseenNotificationCounter;
                });
            }
        }

        $rootScope.$on("changeLogin", updateNotificationCounter);
    })
    .controller('ToastCtrl',['$scope','$hideToast',function($scope, $hideToast) {
        $scope.closeToast = function() {
            $hideToast();
        };
    }]).controller('LeftNavCtrl',function($scope,$mdSidenav,$state,Profile,Tag,Recommendation,$q,Project,Challenge){
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
                case 'ideas':
                    getTags().then(function(){
                        $scope.sideNavTemplateUrl = 'modules/idea/templates/tags-ideas.tpl.html';
                    });
                    break;
                case 'challengeAdmin':
                    $scope.sideNavTemplateUrl = 'modules/common/leftNav/admin-challenges.tpl.html';
                    break;
                
                case 'project.home':
                case 'project.trello':
                case 'project.admin':
                case 'workspace':
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
                    $scope.sideNavTemplateUrl = 'modules/common/leftNav/admin-project.tpl.html';

                    break;

            }
        });
    }).controller('BodyCtrl', function($scope, $mdSidenav) {
        $scope.rightSidenavIsOpen = function() {
            return $mdSidenav('right').isOpen();
        }
    });
