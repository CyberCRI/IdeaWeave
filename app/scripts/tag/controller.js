angular.module('cri.tag',[])
    .controller('TagCtrl',['$scope','$stateParams','Tag','$timeout','$sce',function($scope,$stateParams,Tag,$timeout,$sce){

        $scope.d3OnClick = function(item) {
            $scope.$apply(function() {
                if(item.brief){
                    item.secureBrief = $sce.trustAsHtml(item.brief);
                }
                $scope.showDetailPanel = false;
                $timeout(function(){
                    if (!$scope.showDetailPanel){}
                        $scope.showDetailPanel = true;
                    $scope.detailItem = item;
                },10)
            });
        };

        $scope.d3TagData = {};

        Tag.search($stateParams.title).then(function(data){
            console.log(data)
            $scope.tagdatas=data;
            $scope.d3TagData = Tag.d3FormatData(data,$stateParams.title);
        }).catch(function(err){
            console.log(err)
        })


    }]);
  