angular.module('cri.admin',[])

    .controller('adminCtrl', ['$scope','tags','usersList', function($scope,tags,usersList){
        $scope.tags = tags;
        $scope.usersList = usersList;
        $scope.statusList = [
            {
                title : 'admin',
                index : 0
            },
            {
                title : 'moderator',
                index : 1
            },
            {
                title : 'basic',
                index : 2
            }
        ]
    }])
    .controller('adminProjectCtrl',['$scope', function($scope){

    }])
    .controller('adminChallengeCtrl',['$scope',function($scope){

    }])
    .controller('adminUsersCtrl',['$scope', function($scope){

    }])
