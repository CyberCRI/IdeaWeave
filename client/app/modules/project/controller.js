angular.module('cri.project',[])
    .controller('ProjectCtrl',['$scope','Project','project','$modal', 'loggedUser', 'toaster','users','$sce','CONFIG','$state','loggedUser',function($scope,Project,project,$modal, loggedUser, toaster,users,$sce,CONFIG,$state,loggedUser){

        $scope.project = Project.data = project[0];
        if(loggedUser){
            $scope.me = loggedUser.profile;
        }else{
            $scope.me = {
                id : null
            }
        }
        $scope.infoEditable = false;
        $scope.actionInfo = function(title){
            if($scope.me.id == $scope.project.owner) {
                if($scope.infoEditable){
                    Project.update($scope.project.id, { title: title}).then(function () {
                        toaster.pop('success', 'success', 'profile updated');
                    }).catch(function (err) {
                        toaster.pop('error', 'error', 'profile updated');
                    })
                }
                $scope.infoEditable = !$scope.infoEditable;
            }
        };


        var projectId = $scope.project.id;
        $scope.editPicture = function() {
            if ($scope.me.id == $scope.project.owner) {
                var modalInstance = $modal.open({
                    templateUrl: 'modules/project/templates/poster.tpl.html',
                    controller: ['$scope','Project','toaster','$modalInstance',function ($scope,Project,toaster,$modalInstance) {
                        $scope.$on('cropReady',function(e,data){
                            Project.update(projectId,{ poster : data }).then(function(){
                                $modalInstance.close(data);
                            }).catch(function(err){
                                $modalInstance.close(data);
                                toaster.pop('error',err.status,err.message);
                            })
                        })

                    }],
                    size: 'lg',
                    windowTemplateUrl : 'modules/common/modal/modal-transparent.tpl.html',
                    backdrop : 'static'
                });
                modalInstance.result.then(function(data){
                    $scope.project.poster = data;
                })
            }
        };


        $scope.mapOptions = CONFIG.mapOptions;


        if($scope.project.localisation){
            $scope.map = {
                center: {
                    latitude: $scope.project.localisation.geometry.location.lat,
                    longitude: $scope.project.localisation.geometry.location.lng
                },
                zoom: 8
            };
        }
        if($scope.project.presentation){
            $scope.project.presentationDisplay = $sce.trustAsHtml($scope.project.presentation);
        }

        $scope.user = loggedUser.profile;
        $scope.isLoggedIn = users.isLoggedIn();
        $scope.project=project[0];
        $scope.proccess = ($scope.project.score/9).toFixed(2);


        $scope.d3Tags = [];
        angular.forEach($scope.project.tags,function(v,k){
            $scope.d3Tags.push({
                title : v,
                number : 1
            })
        });

        $scope.showTag = function(e){
            $state.go('tag',{title : e.text})
        }

        $scope.openRqteam = function () {
            $modal.open({
                templateUrl:'apply',
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.tmsg={};
                    $scope.applyTeamMsg=function(){
                        $scope.tmsg.container=project[0].id;
                        Project.apply($scope.tmsg).then(function(data){
                            $scope.tmsg={};
                            $scope.cancel();
                            toaster.pop('success','success','Sent successfully! Cool to get 5 points.');
                        }).catch(function(err){
                            toaster.pop('error',err.status,err.message);
                        })
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }]
            });
        };

        $scope.openShare = function () {
            $modal.open({
                templateUrl:'share',
                controller: ['$scope','$modalInstance','$stateParams',function($scope,$modalInstance,$stateParams){
                    $scope.pid = $stateParams.pid;
                    $scope.cid = $stateParams.cid;
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }]
            });
        };

        if(loggedUser.profile){
            if(loggedUser.profile.id == project[0].owner){
                $scope.isOwner = true;
                $scope.isVisitor = false;
            }else{
                $scope.isVisitor = true;
            }
        }


        $scope.isProjectMember = function(){
            angular.forEach(project[0].member,function(v,k){
                if(loggedUser.profile.id == v){
                    $scope.isVisitor = false;
                    return true;
                }
            })
        }


        $scope.isProjectFollower = function(){
            angular.forEach(project[0].followers,function(v,k){
                if(loggedUser.profile.id == v){
                    $scope.isVisitor = false;
                    return true;
                }
            })
        }
        // follow project
        $scope.isFollow=false;
        if(loggedUser.profile){
            if($scope.project.followers.indexOf(loggedUser.profile.id)!==-1){
                $scope.isFollow=true;
            }
        }

        $scope.follow=function(){
            Project.follow($scope.project.id).then(function(result){
                if(result.error){
                    alert(result.error)
                }else{
                    toaster.pop('success','success','Concerned about the success!');
                    $scope.project.followers.push(loggedUser.profile.id);
                    $scope.isFollow=true;
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message)
            })
        }

        $scope.unfollow=function(){
            Project.unfollow($scope.project.id).then(function(result){
                if(result.error){
                    toaster.pop('error','error',result.error);
                }else{
                    toaster.pop('success','success','Concerned about the success!');
                    $scope.project.followers.splice($scope.project.followers.indexOf(loggedUser.profile.id),1);
                    $scope.isFollow=false;
                }
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])
    .controller('ProjectExploreCtrl',['$scope','projects','loggedUser','Challenge','Project','$state','toaster',
        function ($scope,projects,loggedUser,Challenge,Project,$state,toaster) {

            $scope.me = loggedUser.profile;

            $scope.filterMode = false;

            $scope.enableFilterMode = function(){
                $scope.filterMode = !$scope.filterMode;
            }



            $scope.projects = projects;
            if(Challenge.data){
                Challenge.data.projects = projects;
            }

            var option={$limit:6,$sort:{score:-1},context:'list'};


            $scope.loadProjects=function(option) {
                $scope.isLoading = true;
                Project.fetch(option).then(function (result) {
                    $scope.projects = result;
                    $scope.isLoading = false;
                }).catch(function(err){
                    toaster.pop('error',err.status,err.message);
                })
            };
            // init sortby
            $scope.sortBy='0';
            function updateSort(){
                switch($scope.sortBy){
                    case '0':
                        option.$sort={};
                        option.$sort.score=-1;
                        break;
                    case '1':
                        option.$sort={};
                        option.$sort.updateDate=-1;
                        break;
                    case '2':
                        option.$sort={};
                        option.$sort.createDate=-1;
                        break;
                }
            }

            $scope.noPage=1;
            $scope.isEnd=false;
            $scope.loadMoreProjects=function(num){
                updateSort();
                $scope.noPage=num+1;
                option.$skip=6*num;
                if(!$scope.isEnd){
                    Project.fetch(option).then(function(result){
                        if(result.length>0){
                            for(var i=0;i<result.length;i++){
                                $scope.projects.push(result[i]);
                            }
                        }else{
                            $scope.isEnd=true;
                        }
                    })
                }
            };

            function uniqueObject(arr){
                var o={},i,j,r=[];
                for(var i=0;i<arr.length;i++) o[arr[i]['id']]=arr[i];
                for(var j in o) r.push(o[j])
                return r;
            }
            // query search
            $scope.queryProject=function(){
                if($scope.searchProject){
                    // search title
                    var projects=[];
                    var count=0;
                    queryTag($scope.searchProject,function(datas){
                        count++;
                        projects=projects.concat(datas);
                        if(count==3){
                            $scope.projects=uniqueObject(projects);
                        }
                    });
                }else{
                    $scope.loadProjects();
                }
            };
            function queryTag(tag,callback){
                Project.fetch({title:{$regex:tag+".*",$options: 'i'},context:'list'}).then(function(data){
                    if(data.length>0){
                        callback(data);
                    }else{
                        callback();
                    }
                });
                Project.fetch({brief:{$regex:tag+".*",$options: 'i'},context:'list'}).then(function(data){
                    if(data.length>0){
                        callback(data);
                    }else{
                        callback();
                    }
                });

                Project.fetch({tags:{$regex:tag+".*",$options: 'i'},context:'list'}).then(function(data){
                    if(data.length>0){
                        callback(data);
                    }else{
                        callback();
                    }
                });
            }

    }])

    .controller('ProjectJoinCtrl',['$scope','users','CONFIG','Project','$state','toaster','$stateParams','project',function ($scope,users,CONFIG,Project,$state,toaster,$stateParams,project) {
        $scope.user = users;
        Project.data = project;
//        $scope.ref='/project/setting/'+$stateParams.pid+'/join/'+$stateParams.jid;
        $scope.joinTeam=function(){
            Project.join($stateParams.id).then(function(data){
                toaster.pop('success','success','Welcome to '+Project.data.title);
                $state.go('project.settings.basic',{ pid : Project.data.accessUrl });
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])
    .controller('ProjectCreateCtrl',['$scope', 'Project', 'loggedUser', '$state', 'Challenge', 'toaster', 'Gmap', 'Files', 'CONFIG','$window',function($scope, Project, loggedUser, $state, Challenge, toaster, Gmap, Files, CONFIG,$window){

        $scope.back = function(){
            $window.history.back();
        };
        $scope.newProject = {};
        $scope.titleChange = function(title){
            $scope.newProject.accessUrl = title.replace(/ /g,"_");
        }

        $scope.refreshAddresses = function(address) {
            Gmap.getAdress(address).then(function(adresses){
                $scope.addresses = adresses;
            })
        };
        $scope.tinymceOption = CONFIG.tinymceOptions;
        $scope.createProject = function(){
            $scope.newProject.owner = loggedUser.profile.id;
            $scope.newProject.container = Challenge.data.id;
            Project.create($scope.newProject).then(function(){
                $state.go('project',{ pid : Project.data.accessUrl });
            }).catch(function(err){
                console.log(err)
                toaster.pop('error',err.status,err.message);
            })
        }


    }])