angular.module('cri.tag',[])
    .controller('TagCtrl',['$scope','tagDatas','$stateParams','Tag',function($scope,tagDatas,$stateParams,Tag){
        $scope.tagdatas=tagDatas;
        $scope.queryTag=function(tag){
            Tag.fetch(tag).then(function(data){
                $scope.tagdatas=data;
            }).catch(function(err){
                console.log('error',err);
            })
        }
    }]);
  