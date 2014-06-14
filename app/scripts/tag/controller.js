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
            $scope.d3TagData = {
                nodes : [
                    {
                        name : $stateParams.title,
                        group : 1
                    }
                ],
                links : [

                ]
            }
            angular.forEach(data.users,function(v,k){
                var node = {
                    name : v.username,
                    group : 2,
                    poster : v.poster,
                    brief : v.brief
                };
                $scope.d3TagData.nodes.push(node);

                var link = {
                    source : $scope.d3TagData.nodes.indexOf(node),
                    target : 0
                };
                $scope.d3TagData.links.push(link);
            })
            angular.forEach(data.challenges,function(v,k){
                var node = {
                    name : v.title,
                    group : 3,
                    poster : v.poster,
                    brief : v.brief
                };
                $scope.d3TagData.nodes.push(node);

                var link = {
                    source : $scope.d3TagData.nodes.indexOf(node),
                    target : 0
                };
                $scope.d3TagData.links.push(link);
            })
            angular.forEach(data.projects,function(v,k){
                var node = {
                    name : v.title,
                    group : 4,
                    poster : v.poster,
                    brief : v.brief
                };
                $scope.d3TagData.nodes.push(node);

                var link = {
                    source : $scope.d3TagData.nodes.indexOf(node),
                    target : 0
                };
                $scope.d3TagData.links.push(link);
            })


        }).catch(function(err){
            console.log(err)
        })


    }]);
  