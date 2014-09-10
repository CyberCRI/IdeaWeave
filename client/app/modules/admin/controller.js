angular.module('cri.admin',[])

    .controller('adminCtrl', ['$scope','tags','usersList','users','Notification', function($scope,tags,usersList,users,Notification){
        $scope.tags = tags;
        $scope.usersList = usersList;
        $scope.statusList = [
            'admin',
            'moderator',
            'basic'

        ];

        $scope.updateStatus = function(user){

            users.update(user.id,user).then(function(){
                Notification.display("user's status succesfully updated");
            }).catch(function(err){
                Notification.display("error user's status is not updated");
            })
        };

        $scope.removeUser = function(id,$index){
            users.remove(id).then(function(){
                Notification.display('user succesfully remove');
                $scope.usersList.splice($index,1);
            }).catch(function(err){
                Notification.display('error the user is not removed');
            })
        }
    }])
    .controller('adminUsersCtrl',['$scope', function($scope){

    }])
