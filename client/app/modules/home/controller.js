angular.module('cri.home',[])
.controller('MainCtrl',['$scope','tags','$state','popularThings','loggedUser',
    function($scope,tags,$state,popularThings,loggedUser){
        $scope.me = loggedUser.profile;
//        $scope.locations = positions[0].concat(positions[1])
//        $scope.locations = $scope.locations.concat(positions[2])
        console.log('popular',popularThings);
        $scope.challenges = popularThings.data.challenges || [];
        $scope.challenges.splice(0,0,{intro : 2});
        $scope.challenges.splice(0,0,{intro : 1});
        $scope.projects = popularThings.data.projects || [];

//        $scope.mapOptions = CONFIG.mapOptions;
//        angular.forEach($scope.locations,function(v,k){
//            if(v.localisation){
//                $scope.locations[k] = {
//                    latitude : v.localisation.geometry.location.lat,
//                    longitude : v.localisation.geometry.location.lng
//                }
//            }else {
////                delete $scope.locations[k];
//            }
//        })

        $scope.tags = tags;
        $scope.showTag = function(e){
            $state.go('tag',{title : e.text})
        }

    }])
    .controller('HomeCtrl',['$scope','tags','$state','recommendThings','loggedUser',
        function($scope,tags,$state,recommendThings,loggedUser){
            $scope.me = loggedUser.profile;
            console.log('recommend',recommendThings);
            $scope.challenges = recommendThings.challenges.data;
            $scope.projects = recommendThings.projects.data;

            $scope.tags = tags;
            $scope.showTag = function(e){
                $state.go('tag',{title : e.text})
            }
    }]);
