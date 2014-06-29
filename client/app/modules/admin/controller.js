angular.module('cri.admin',[])

    .controller('adminCtrl', ['$scope','projects','challenges', function($scope,projects,challenges){
        $scope.projects = projects;
        $scope.challenges = challenges;
        console.log(projects,challenges)
    }])
    .controller('adminProjectCtrl',['$scope', function($scope){

    }])
    .controller('adminChallengeCtrl',['$scope',function($scope){

    }])
    .controller('adminUsersCtrl',['$scope', function($scope){

    }])
