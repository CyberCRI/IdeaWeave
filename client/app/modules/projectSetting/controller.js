angular.module('cri.projectSetting',[])
    .controller('ProjectSettingCtrl',['$scope','project','users','files','urls',function($scope,project,users,files,urls){
        $scope.user = users;
        $scope.project = project[0];

        $scope.files = files;

        $scope.urls = urls;

    }])
    .controller('ProjectPosterCtrl',['$scope','Project','Notification',function($scope,Project,Notification){
        $scope.$watch('imageCropResult', function(newVal) {
            if (newVal) {
                Project.update($scope.project.id, { poster: newVal }).then(function () {
                    $scope.project.poster = newVal;
                    Notification.display("Challenge's poster updated");
                }).catch(function (err) {
                    Notification.display(err.message);
                })
            }
        })
    }])
    .controller('ProjectBasicCtrl',['$scope','$stateParams','Project','$modal','$state','Notification','CONFIG',function ($scope,$stateParams,Project,$modal,$state,Notification,CONFIG) {
        $scope.options = {
            height: 200,
            focus: true
        }

        $scope.tinymceOptions = CONFIG.tinymceOptions;
//        $scope.project=project;

        //Update project
        $scope.updateProject=function() {
            Project.update($scope.project.id,$scope.project).then(function (result) {
                console.log(result)
                Notification.display('Update Success!');
            }).catch(function (err) {
                Notification.display(err.message);
            })
        }

        $scope.$on('cropReady',function(e,data){
            $scope.project.banner = data;
        })
//        $scope.$watch('bannerResult', function(newVal) {
//            console.log('yeah',newVal)
//            if (newVal) {
//                Project.update($scope.project.id,{ banner : newVal }).then(function(){
//                    $scope.challenge.poster = newVal;
//                    Notification.display("Challenge's banner updated");
//                }).catch(function(err){
//                    Notification.display(err.message);
//                })
//            }
//        });

        // delete project
        $scope.opendel = function () {
            var delModelInstance=$modal.open({
                templateUrl:'projectDel.html',
                controller:['$scope','$modalInstance','Notification',function($scope,$modalInstance,Notification){
                    $scope.deleteProject=function(){
                        Project.delete(Project.data.id).then(function(data){
                            Notification.display('project removed successfully');
                            $modalInstance.dismiss('cancel');
                            var challengeId = Project.data.container;
                            Project.data = {};
                            $state.go('challenge',{ pid : challengeId });
                        }).catch(function(err){
                            Notification.display(err.message);
                            $modalInstance.dismiss('cancel');
                        })
                    };
                }]
            })
        };
    }])
    .controller('ProjectMediaCtrl',['$scope', 'Notification','Files','Url','CONFIG',function ($scope, Notification,Files,Url,CONFIG) {
        $scope.removeFile = function(file){
            Files.remove(file.id).then(function(){
                Notification.display('file remove succesfully');
                $scope.files.splice($scope.files.indexOf(file),1);
            }).catch(function(err){
                Notification.display(err.message);
            })
        };

        angular.forEach($scope.files,function(file,index){
            $scope.files[index].url = CONFIG.apiServer+'/fileUpload/topic/'+file.projectUrl+'/'+file.filename
        });


        $scope.updateUrl = function(url){
            Url.update(url).then(function(data){
                Notification.display('url updated succesfully');
            }).catch(function(err){
                Notification.display('update fail');
            })
        };


    }])


    .controller('ProjectTeamCtrl',['$scope','Project','Notification',function ($scope,Project,Notification) {
        $scope.removeMember=function(idx,user){
            Project.update({member:{$pull:user.id}},Project.data.id).then(function(result){
                Notification.display('Successfully removed');
                $scope.project.member.splice(idx,1);
            }).catch(function(err){
                Notification.display('Remove failed, please try again later');
            });
        }

        $scope.invite={};
        $scope.sendInvite=function(){
            $scope.invite.pid=Project.data.id;
            Project.sendInvite($scope.invite).then(function(result){
                Notification.display('invitation send successfully');
                $scope.invite.email="";
            }).catch(function(err){
                Notification.display('Failed,Please try again later.');
            })
        };

        Project.getApply({container:Project.data.id,$sort:{createDate:-1}}).then(function(applyteams){
            $scope.applyteams=applyteams;
        }).catch(function(err){
            console.log(err);
        });

        $scope.finish=function(idx){
            Project.finishApply({status:true}, $scope.applyteams[idx].id).then(function(data){
                $scope.applyteams[idx].status=true;
                Notification.display('Updated successfully!');
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
        $scope.addToTeam=function(uid,idx){
            Project.update($scope.project.id,{member:{'$push':uid},'context':'team'}).then(function(){
//            Project.update({uid : uid , context :'team'},$scope.project.id).then(function(){
                $scope.finish(idx);
                Notification.display('Successfully added');
            }).catch(function(err){
                Notification.display(err.message);
            })
        }
    }])



