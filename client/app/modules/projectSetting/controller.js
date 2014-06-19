angular.module('cri.projectSetting',[])
    .controller('ProjectSettingCtrl',['$scope','project','users',function($scope,project,users){
        $scope.user = users;
        $scope.project = project[0];
    }])
    .controller('ProjectBasicCtrl',['$scope','$stateParams','Project','$modal','$state','toaster',function ($scope,$stateParams,Project,$modal,$state,toaster) {
        $scope.options = {
            height: 200,
            focus: true
        }

//        $scope.project=project;

        //Update project
        $scope.updateProject=function(project) {
            Project.update(project, project.id).then(function (result) {
                toaster.pop('success', 'success', 'Update Success!');
            }).catch(function (err) {
                toaster.pop('error', err.status, err.message);
            })
        }

        // save poster


        // delete project
        $scope.opendel = function () {
            var delModelInstance=$modal.open({
                templateUrl:'projectDel.html',
                controller:['$scope','$modalInstance','toaster',function($scope,$modalInstance,toaster){
                    $scope.deleteProject=function(){
                        Project.delete(Project.data.id).then(function(data){
                            toaster.pop('success','success','project removed successfully');
                            $modalInstance.dismiss('cancel');
                            var challengeId = Project.data.container;
                            Project.data = {};
                            $state.go('challenge',{ pid : challengeId });
                        }).catch(function(err){
                            toaster.pop('error',err.status,err.message);
                            $modalInstance.dismiss('cancel');
                        })
                    };
                }]
            })
        };
    }])
    .controller('ProjectMediaCtrl',['$scope', 'toaster','Socket','files','Files',function ($scope, toaster,Socket,files,Files) {

        $scope.removeFile = function(file){
            Files.remove(file.id).then(function(){
                toaster.pop('success','success','file remove succesfully');
                $scope.files.splice($scope.files.indexOf(file),1);
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }

        $scope.files = files;

        Socket.on('file:create',function(data){
//            jzCommon.query(apiServer+'/files',{id:data.id,container:$stateParams.pid,context:'list'}).then(function(result){
//                $scope.pfiles.push(result);
//            })
            //todo mettre ca dans le service file
        })

    }])

    .controller('ProjectApplyCtrl',['$scope','applyteams','Project','toaster',function ($scope,applyteams,Project,toaster) {
        $scope.applyteams=applyteams;

        $scope.finish=function(idx){
            Project.finishApply({status:true}, $scope.applyteams[idx].id).then(function(data){
                $scope.applyteams[idx].status=true;
                toaster.pop('success','success','Updated successfully!');
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
        $scope.addToTeam=function(uid,idx){
            console.log('ctrl',uid,idx)
            Project.update({member:{'$push':uid},'context':'team'},$scope.project.id).then(function(){
//            Project.update({uid : uid , context :'team'},$scope.project.id).then(function(){
                $scope.finish(idx);
                toaster.pop('success','success','Successfully added');
            }).catch(function(err){
                toaster.pop('error',err.status,err.message);
            })
        }
    }])

    .controller('ProjectTeamCtrl',['$scope','Project','toaster',function ($scope,Project,toaster) {
        $scope.removeMember=function(idx,user){
            Project.update({member:{$pull:user.id}},Project.data.id).then(function(result){
                toaster.pop('success','success','Successfully removed');
                $scope.project.member.splice(idx,1);
            }).catch(function(err){
                toaster.pop('error','error','Remove failed, please try again later');
            });
        }

        $scope.invite={};
        $scope.sendInvite=function(){
            $scope.invite.pid=Project.data.id;
            console.log($scope.invite)
            Project.sendInvite($scope.invite).then(function(result){
                toaster.pop('success','success','invitation send successfully');
                $scope.invite.email="";
            }).catch(function(err){
                toaster.pop('error','error','Failed,Please try again later.');
            })
        }
    }])



