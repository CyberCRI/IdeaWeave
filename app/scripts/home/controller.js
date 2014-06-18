angular.module('cri.home',[])
.controller('HomeCtrl',function($scope,tags,positions,challenges,$timeout,CONFIG,$state,parallaxHelper){

        $scope.servicesParalax = parallaxHelper.createAnimator(-0.6);

        $scope.tagCloudParalax = parallaxHelper.createAnimator(0.3);

        $scope.locations = positions[0].concat(positions[1])
        $scope.locations = $scope.locations.concat(positions[2])

        $scope.challenges = challenges;

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

    })
