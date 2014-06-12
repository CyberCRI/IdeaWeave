angular.module('cri.common')
    .directive('tagManager',['$http','CONFIG','Tag',function($http,CONFIG,Tag){
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

                Tag.fetch().then(function(result){
                    $scope.toptags=result;
                }).catch(function(err){
                    console.log(err);
                })


                $scope.addRecTag=function(value){
                    $scope.newValue=value;
                    $scope.add();
                }

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

                };
                // This is the ng-click handler to remove an item
                $scope.remove = function(idx){
                    $scope.entity.tags.splice( idx, 1 );
                };
                // Capture all keypresses

                 var input= $element.find('input');
                 input.bind('keypress',function (event){
                    if(event.charCode===13){
                        $scope.$apply($scope.add);
                    }
                 });

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
    })
    .directive('tagSugestion',function(){
        return {
            restrict : 'EA',
            templateUrl : ''
        }
    })