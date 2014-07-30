angular.module('cri.common')
    .directive('tagManager',['$http','CONFIG','Tag',function($http,CONFIG,Tag){
        return {
            restrict:'EAC',
            scope:{entity:'='},
            replace:true,
            templateUrl:'modules/common/directives/tagManager/tags.tpl.html',
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
                    $scope.tags=result;
                }).catch(function(err){
                    console.log(err);
                })


                $scope.addRecTag=function(value){
                    $scope.newValue=value;
                    $scope.add();
                }

                if($scope.entity === undefined){
                    $scope.entity = {
                        tags : []
                    }
                };

                if($scope.entity.tags===undefined){
                    $scope.entity.tags=[];
                }

                // This adds the new tag to the tags array
                $scope.add = function(tag){
                    var exist = false;
                    for(var i in $scope.tags){
                        if($scope.tags[i].title == tag){
                            exist = true;
                            break;
                        }
                    }
                    if(!exist){
                        Tag.create({title : tag}).catch(function(err){
                            console.log(err)
                        })
                    }

                    // fix dulplicate
                    if(!inArray(tag,$scope.entity.tags)){
                        $scope.entity.tags.push( tag );
                        $scope.myTag ='';
                    }else{
                        $scope.myTag ='';
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
                        $scope.$apply($scope.add($scope.myTag));
                        event.stopPropagation();
                        event.preventDefault();
                    }
                 });

            }
        };
    }])
    .directive('showtags',function(){
        return {
            restrict: 'EAC',
            scope: { entity: '=' },
            template:'<ul class="list-unstyled" style="display: inline-block;">'+'<li ng-repeat="tag in entity.tags | limitTo: 2" class="inline mas"><a ui-sref="tag({ title : tag })" class="text-muted" target="_self">#{{tag}}</a></li>'+
                '</ul>'
        };
    })
    .directive('tagSugestion',function(){
        return {
            restrict : 'EA',
            templateUrl : ''
        }
    })