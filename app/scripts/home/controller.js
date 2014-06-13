angular.module('cri.home',[])
.controller('HomeCtrl',function($scope,tags,positions,challenges,$timeout,CONFIG){
        console.log(positions)

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
        $timeout(function(){
            TagCanvas.Start('myCanvas','tags',{
                textColour: 'black',
                outlineColour: '#ff00ff',
                reverse: true,
                depth: 1,
                maxSpeed: 0.2
            });
        },500)

    })
