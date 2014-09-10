angular.module('cri.home',[])
.controller('HomeCtrl',['$scope','$state','popularThings','tags','$location','$anchorScroll',
    function($scope,$state,popularThings,tags,$location, $anchorScroll){
        console.log(popularThings)
        $scope.challenges = popularThings.data.challenges || [];
        $scope.challenges.unshift({intro : 3});
        $scope.challenges.unshift({intro : 2});
        $scope.challenges.unshift({intro : 1});
        $scope.projects = popularThings.data.projects || [];

        $scope.tags = tags;

        $scope.toSignUp = function(){
            $location.hash('signup');
            $anchorScroll();
        }

    }]);