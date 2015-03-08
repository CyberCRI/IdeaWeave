angular.module('cri.tag',[])
    .controller('TagCtrl',['$scope','$state','$stateParams','Tag','$timeout','$sce','Notification',function($scope,$state,$stateParams,Tag,$timeout,$sce,Notification){

        Tag.search($stateParams.title).then(function(data){
            $scope.tagData=data;
        }).catch(function(err){
            console.log(err);
        });
    }]);