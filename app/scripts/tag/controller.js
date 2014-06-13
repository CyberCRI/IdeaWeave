angular.module('cri.tag',[])
    .controller('TagCtrl',['$scope','$stateParams','Tag','users',function($scope,$stateParams,Tag,users){


        Tag.search($stateParams.title).then(function(data){
            console.log(data)
            $scope.tagdatas=data;
        }).catch(function(err){
            console.log(err)
        })


    }]);
  