angular.module('cri.tag',[])
    .controller('TagCtrl',['$scope','$state','$stateParams','Tag','$timeout','$sce','Notification',function($scope,$state,$stateParams,Tag,$timeout,$sce,Notification){
    	$scope.isLoading = true;
    	$scope.tag = $stateParams.title;

        Tag.search($stateParams.title).then(function(data){
            $scope.tagData=data;
	    	$scope.isLoading = false;
        }).catch(function(err){
            console.log(err);
        });
    }]);