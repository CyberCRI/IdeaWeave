angular.module('cri.home',[])
.controller('HomeCtrl',['$scope','tags','$state','popularThings','loggedUser',
    function($scope,tags,$state,popularThings,loggedUser){
        $scope.me = loggedUser.profile;
//        $scope.locations = positions[0].concat(positions[1])
//        $scope.locations = $scope.locations.concat(positions[2])
        $scope.challenges = popularThings.data.challenges || [];
        $scope.challenges.splice(0,0,{intro : 2});
        $scope.challenges.splice(0,0,{intro : 1});
        $scope.projects = popularThings.data.projects || [];

        $scope.tags = tags;
        $scope.showTag = function(e){
            $state.go('tag',{title : e.text})
        }

    }]);