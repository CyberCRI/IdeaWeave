angular.module('cri.common')
    .directive('tagManager',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict:'EAC',
            scope:{entity:'='},
            replace:true,
            templateUrl:'scripts/common/directives/tagManager/tags.tpl.html',
            link: function($scope,$element){
                function inArray(value,array){
                    if(typeof value=="string"){
                        var len=array.length;
                        for(var i=0;i<len;i++){
                            if(value===array[i]){
                                return true;
                            }
                        }
                    }
                    return false;
                }
                // get tags

                $http.get(CONFIG.apiServer+'/tags/getTags?'+JSON.stringify({$limit:5})).success(function(result){
                    $scope.toptags=result;
                })


                $scope.addRecTag=function(value){
                    $scope.newValue=value;
                    $scope.add();
                }

                console.log($scope.entity)
                if($scope.entity.tags===undefined){
                    $scope.entity.tags=[];
                }

                // This adds the new tag to the tags array
                $scope.add = function(){

                    // fix dulplicate
                    if(!inArray($scope.newValue,$scope.entity.tags)){
                        $scope.entity.tags.push( $scope.newValue );
                        $scope.newValue ='';
                    }else{
                        $scope.newValue ='';
                    }
                    console.log($scope.entity.tags)

                };
                // This is the ng-click handler to remove an item
                $scope.remove = function(idx){
                    $scope.entity.tags.splice( idx, 1 );
                };
                // Capture all keypresses
                /*
                 var input=angular.element($element.children()[1]);
                 input.bind('keypress',function (event){
                 if(event.keyCode===32){
                 $scope.$apply($scope.add);
                 }
                 });
                 */
            }
        };
    }])
    .directive('showtags',function(){
        return {
            restrict: 'EAC',
            scope: { entity: '=' },
            template:'<ul class="list-unstyled">'+'<li ng-repeat="tag in entity.tags track by $index" class="inline mas"><a ng-href="tag/{{tag}}" class="text-muted" target="_self">#{{tag}}</a></li>'+
                '</ul>'
        };
    });
