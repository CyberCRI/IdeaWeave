angular.module('cri.project',[])
    .controller('ProjectCtrl',['$scope','Project','project', 'Notification','$sce','$materialDialog',function($scope,Project,project, Notification,$sce,$materialDialog){
        $scope.isVisitor = true;
        $scope.project = project[0];
        if($scope.currentUser){
            console.log($scope.currentUser._id,$scope.project.owner._id)
            if($scope.currentUser._id == $scope.project.owner._id){
                $scope.isMember = true;
                $scope.isOwner = true;
                $scope.isVisitor = false;
            }else{
                angular.forEach($scope.project.members,function(member){
                    if(member._id == $scope.currentUser._id){
                        $scope.isVisitor = false;
                        $scope.isMember=true;
                    }
                });
                angular.forEach($scope.project.followers,function(follower){
                    if(follower._id == $scope.currentUser._id){
                        $scope.isVisitor = false;
                        $scope.isFollow=true;
                    }
                });
            }
        }

        $scope.proccess = ($scope.project.score/9).toFixed(2);

//        $scope.d3Tags = [];
//        angular.forEach($scope.project.tags,function(v,k){
//            $scope.d3Tags.push({
//                title : v,
//                number : 1
//            })
//        });
//
//        $scope.showTag = function(e){
//            $state.go('tag',{title : e.text})
//        }

        $scope.openApplyModal = function (e) {
            $materialDialog({
                templateUrl: 'modules/project/templates/modal/applyTeamModal.tpl.html',
                targetEvent: e,
                locals : {
                    project  : $scope.project,
                    currentUser : $scope.currentUser
                },
                controller: ['$scope','$hideDialog','project','currentUser',function($scope,$hideDialog,project,currentUser){
                    $scope.apply={};
                    $scope.applyTeamMsg=function(){
                        $scope.apply.container=project._id;
                        $scope.apply.owner = currentUser._id;
                        $scope.apply.status= false;
                        Project.apply($scope.apply).then(function(data){
                            $scope.apply={};
                            $scope.cancel();
                            Notification.display('Apply sent successfully');
                        }).catch(function(err){
                            Notification.display(err.message);
                        });
                    };
                    $scope.cancel = function () {
                        $hideDialog();
                    };
                }]
            });
        };

        $scope.openShare = function (e) {
            $materialDialog({
                templateUrl: 'modules/project/templates/modal/shareModal.tpl.html',
                targetEvent: e,
                controller:['$scope','$hideDialog','$stateParams',function($scope,$hideDialog,$stateParams){
                    $scope.pid = $stateParams.pid;
                    $scope.cid = $stateParams.cid;
                    $scope.cancel = function () {
                        $hideDialog();
                    };
                }]
            });
        };

        $scope.follow=function(){
            if($scope.isFollow){
                var param = {
                    follower : $scope.currentUser._id,
                    following : $scope.project._id
                };
                Project.unfollow(param).then(function(result){
                    Notification.display('you will no longuer receive notification about this');
                    $scope.project.followers.splice($scope.project.followers.indexOf($scope.currentUser._id),1);
                    $scope.isFollow=false;
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }else{
                var param = {
                    follower : $scope.currentUser._id,
                    following : $scope.project._id
                };
                Project.follow(param).then(function(result){
                    Notification.display('You will now be notified about this project');
                    $scope.project.followers.push($scope.currentUser._id);
                    $scope.isFollow=true;
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        };
    }])
    .controller('ProjectsCtrl',['$scope','$rootScope',function($scope,$rootScope){
        $scope.toggleLeft = function(){
            $rootScope.$broadcast('toggleLeft');
        };
    }])
    .controller('ProjectsListCtrl',['$scope','projects','Notification','Project','$stateParams','Config','$materialDialog',function($scope,projects,Notification,Project,$stateParams,Config,$materialDialog){
        $scope.projects = projects;
        $scope.noPage = 0;
        $scope.isEnd = false;
        $scope.now = new Date().getTime();
        var option = { limit : Config.paginateChallenge };
        $scope.loadMoreProjects = function () {
            $scope.noPage++;
            option.skip = Config.paginateChallenge * $scope.noPage;
            if (!$scope.isEnd) {
                Project.getByTag($stateParams.tag,option).then(function (result) {
                    if (result.length > 0) {
                        angular.forEach(result,function(project){
                            $scope.projects.push(project);
                        });
                    } else {
                        $scope.isEnd = true;
                        Notification.display('there is no more projects');
                    }
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        };
    }])

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
        $scope.newProject = {};

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
            newProject.container = $scope.newProject.container._id;
            Project.create($scope.newProject).then(function(data){
                $state.go('project',{ pid : data.accessUrl });
            }).catch(function(err){
                Notification.display(err.message);
            }).finally(function(){
                $scope.isloading = false;
            });
        };
    }]);