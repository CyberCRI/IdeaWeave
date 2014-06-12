angular.module('cri.home',[])
.controller('HomeCtrl',function($scope,tags,positions){
        console.log(positions)

        $scope.locations = positions[0].concat(positions[1])
        $scope.locations = $scope.locations.concat(positions[2])

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
        console.log($scope.locations);

        $scope.tags = tags;
        TagCanvas.Start('myCanvas','tags',{
            textColour: '#ff0000',
            outlineColour: '#ff00ff',
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.05
        });

    })
