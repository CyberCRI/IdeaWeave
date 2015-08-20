angular.module('cri.home',[])
.controller('HomeCtrl',['$scope','$state','popularThings','tags','$location','$anchorScroll',
    function($scope,$state,popularThings,tags,$location, $anchorScroll){
        var maximumCharBrief = 30;
        $scope.challenges = popularThings.data.challenges || [];
        $scope.challenges.unshift({intro : 3});
        $scope.challenges.unshift({intro : 2});
        $scope.challenges.unshift({intro : 1});
        $scope.projects = popularThings.data.projects || [];


        for(var i = $scope.projects.length;i--;){
            if($scope.projects[i].brief.length > maximumCharBrief) {
                $scope.projects[i].brief = $scope.projects[i].brief.slice(0, maximumCharBrief - 4) + " ...";
            }
        }

        $scope.tags = tags;

        $scope.toSignUp = function(){
            $location.hash('signup');
            $anchorScroll();
        };
    }]);