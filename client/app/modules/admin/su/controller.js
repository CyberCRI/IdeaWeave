angular.module('cri.admin',['cri.admin.profile','cri.admin.challenge','cri.admin.project'])

    .controller('adminCtrl', ['$scope','tags','usersList','Profile','Notification', function($scope,tags,usersList,Profile,Notification){
        $scope.tags = tags;
        $scope.usersList = usersList;
        $scope.statusList = [
            'admin',
            'moderator',
            'basic'

        ];

        $scope.updateStatus = function(user){

            Profile.update(user.id,user).then(function(){
                Notification.display("user's status succesfully updated");
            }).catch(function(err){
                Notification.display("error user's status is not updated");
            })
        };

        $scope.removeUser = function(id,$index){
            Profile.remove(id).then(function(){
                Notification.display('user succesfully remove');
                $scope.usersList.splice($index,1);
            }).catch(function(err){
                Notification.display('error the user is not removed');
            })
        }
    }]);

