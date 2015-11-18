angular.module('cri.project',[])
    .controller('ProjectCtrl', function($scope,Project,project, Notification, Challenge,$mdDialog,$rootScope,$state,$analytics) {
        if(project.length == 0) {
            Notification.display('Cannot find the requested project');
            $state.go("home");
            return;
        }

        $scope.project = project[0];

        // Load templates        
        $scope.templates = [];
        Challenge.getTemplates($scope.project.container).then(function(templates) {
            $scope.templates = templates;
        });

        $scope.isOwner = $scope.currentUser ? $scope.currentUser._id == $scope.project.owner._id : false;
        $scope.isMember = $scope.currentUser ?  _.chain($scope.project.members).pluck("_id").contains($scope.currentUser._id).value() : false;
        $scope.isFollow = $scope.currentUser ?  _.chain($scope.project.followers).pluck("_id").contains($scope.currentUser._id).value() : false;
        $scope.isLike = $scope.currentUser ?  _.contains($scope.project.likers,$scope.currentUser._id) : false;

        $scope.toggleLeft = function(){
            $rootScope.$broadcast('toggleLeft');
        };

        $scope.openApplyModal = function (e) {
            $mdDialog.show({
                templateUrl: 'modules/project/templates/modal/applyTeamModal.tpl.html',
                targetEvent: e,
                locals : {
                    project  : $scope.project,
                    currentUser : $scope.currentUser
                },
                controller: function($scope,project,currentUser){
                    $scope.apply={};
                    $scope.applyTeamMsg=function(){
                        $scope.apply.container=project._id;
                        $scope.apply.owner = currentUser._id;
                        $scope.apply.status= false;
                        Project.apply($scope.apply).then(function(data){
                            $scope.apply={};
                            $scope.cancel();
                            Notification.display('Application sent');
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    };
                    $scope.cancel = function () {
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.openShare = function (e) {
            $mdDialog.show({
                templateUrl: 'modules/project/templates/modal/shareModal.tpl.html',
                targetEvent: e,
                controller: function($scope,$stateParams){
                    $scope.pid = $stateParams.pid;
                    $scope.cid = $stateParams.cid;
                    $scope.cancel = function () {
                        $mdDialog.hide();
                    };
                }
            });
        };

        $scope.follow=function(){
            var param;
            if($scope.isFollow){
                param = {
                    follower : $scope.currentUser._id,
                    following : $scope.project._id
                };
                Project.unfollow(param).then(function(result){
                    Notification.display('You will no longer be notified about this project');
                    $scope.project.followers.splice($scope.project.followers.indexOf($scope.currentUser._id),1);
                    $scope.isFollow=false;
                    $analytics.eventTrack("unfollowProject");
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }else{
                param = {
                    follower : $scope.currentUser._id,
                    following : $scope.project._id
                };
                Project.follow(param).then(function(result){
                    Notification.display('You will now be notified about this project');
                    $scope.project.followers.push($scope.currentUser._id);
                    $scope.isFollow=true;
                    $analytics.eventTrack("followProject");
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        };

        $scope.like=function(){
            console.log(Project);
            if($scope.isLike){
                Project.dislike($scope.project._id).then(function(result){
                    Notification.display('You no longer like this project');
                    $scope.project.likers.splice($scope.project.likers.indexOf($scope.currentUser._id),1);
                    $scope.isLike=false;
                    $analytics.eventTrack("dislikeProject");
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }else{
                Project.like($scope.project._id).then(function(result){
                    Notification.display('You like this project');
                    $scope.project.likers.push($scope.currentUser._id);
                    $scope.isLike=true;
                    $analytics.eventTrack("likeProject");
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        };
    })
    .controller('ProjectsCtrl',['$scope','$rootScope',function($scope,$rootScope){
        // Nothing
    }])
    .controller('ProjectsListCtrl', function($scope,projects,Notification,Project,$stateParams,Config){
        $scope.projects = projects;

        $scope.sortBy = "newest";
        $scope.sortOptions = ["newest", "most followed", "most members"];

        $scope.$watch("sortBy", function() {
            var sortFunction = null;
            switch($scope.sortBy) {
                case "newest":
                    sortFunction = function(project) {
                        return -1 * Date.parse(project.createDate); 
                    };
                    break
                case "most followed":
                    sortFunction = function(project) {
                        return -1 * project.followers.length; 
                    };
                    break;
                case "most members":
                    sortFunction = function(project) {
                        return -1 * project.members.length; 
                    };
                    break;
            }

            if(sortFunction) {
                $scope.projects = _.sortBy($scope.projects, sortFunction);
            }
        });
    })
    .controller('ProjectJoinCtrl',['$scope','Profile','Config','Project','$state','Notification','$stateParams','project',function ($scope,Profile,Config,Project,$state,Notification,$stateParams,project) {
        Project.data = project;
//        $scope.ref='/project/setting/'+$stateParams.pid+'/join/'+$stateParams.jid;
        $scope.joinTeam=function(){
            Project.join($stateParams.id).then(function(data){
                Notification.display('Welcome to '+Project.data.title);
                $state.go('project.settings.basic',{ pid : Project.data.accessUrl });
            }).catch(function(err){
                Notification.display(err.message);
            });
        };
    }])
    .controller('ProjectCreateCtrl',['$scope', 'Project', '$state', 'Notification', 'Gmap', 'Config', 'challenges',function($scope, Project, $state, Notification, Gmap, Config,challenges){

        $scope.tinymceOption = Config.tinymceOptions;
        $scope.challenges = challenges;
        $scope.newProject = {
            tags: []
        };

        if(Project.challengeSelected){
           $scope.newProject.container = Project.challengeSelected;
        }

        $scope.titleChange = function(title){
            $scope.newProject.accessUrl = title.replace(/ /g,"_");
        };
        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            });
        };
        $scope.createProject = function(newProject){
            $scope.isloading = true;
            newProject.owner = $scope.currentUser._id;
            if($scope.newProject.container) newProject.container = $scope.newProject.container._id;
            Project.create($scope.newProject).then(function(data){
                $state.go('project.home',{ pid : data.accessUrl });
            }).catch(function(err){
                Notification.display(err.message);
            }).finally(function(){
                $scope.isloading = false;
            });
        };
    }]);