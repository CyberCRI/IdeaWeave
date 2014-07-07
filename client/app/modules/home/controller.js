angular.module('cri.home',[])
.controller('HomeCtrl',['$scope','tags','positions','CONFIG','$state','parallaxHelper','popularThings',
    function($scope,tags,positions,CONFIG,$state,parallaxHelper,popularThings){

        $scope.servicesParalax = parallaxHelper.createAnimator(-0.6);

        $scope.tagCloudParalax = parallaxHelper.createAnimator(0.3);

        $scope.locations = positions[0].concat(positions[1])
        $scope.locations = $scope.locations.concat(positions[2])

        console.log('popularThingz',popularThings);
        $scope.challenges = popularThings.data.challenges;
        $scope.projects = popularThings.data.projects;


        $scope.mapOptions = CONFIG.mapOptions;
        angular.forEach($scope.locations,function(v,k){
            if(v.localisation){
                $scope.locations[k] = {
                    latitude : v.localisation.geometry.location.lat,
                    longitude : v.localisation.geometry.location.lng
                }
            }else {
//                delete $scope.locations[k];
            }
        })

        $scope.tags = tags;
        $scope.showTag = function(e){
            $state.go('tag',{title : e.text})
        }

    }])
