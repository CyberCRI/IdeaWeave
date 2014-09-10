angular.module('cri.tag')
    .directive('tagManager',[function(){
        return {
            restrict:'EA',
            scope:{entity:'='},
            replace:true,
            templateUrl:'modules/tag/directives/tags.tpl.html',
            controller : ['$scope','Tag','Notification',function($scope,Tag,Notification){
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


                Tag.fetch().then(function(result){
                    $scope.tags=result;
                }).catch(function(err){
                    console.log(err);
                });

                $scope.add = function(tag){
                    // fix dulplicate
                    if(!inArray(tag,$scope.entity.tags)){
                        $scope.entity.tags.push( tag );
                    }
                    $scope.tags.splice( $scope.tags.indexOf(tag), 1 );
                };

                $scope.remove = function(idx){
                    $scope.tags.push($scope.entity.tags[idx]);
                    $scope.entity.tags.splice( idx, 1 );
                };

                $scope.addNew = function(tag){
                    var exist = false;
                    for(var i in $scope.tags){
                        if($scope.tags[i] == tag){
                            exist = true;
                            break;
                        }
                    }
                    if(!exist){
                        Tag.create(tag).then(function(newTag) {
                            $scope.entity.tags.push(newTag);
                        }).catch(function(err){
                            console.log(err)
                        })
                    }else{
                        Notification.display('this tag already exist');
                    }
                }
            }],
            link: function(scope,element){

                scope.formTag = false;
                scope.addTag = function(){
                    scope.formTag = !scope.formTag;
                };

                if(scope.entity === undefined){
                    scope.entity = {
                        tags : []
                    }
                }else if(scope.entity.tags===undefined){
                    scope.entity.tags=[];
                }

                 var input= element.find('input');
                 input.bind('keypress',function (event){
                    if(event.charCode===13){
                        scope.$apply(scope.add(scope.myTag));
                        event.stopPropagation();
                        event.preventDefault();
                    }
                 });

            }
        };
    }])
    .directive('showtags',function(){
        return {
            restrict: 'EA',
            scope: { entity: '=' },
            template:'<div ng-if="entity.tags.length >0"><i class="fa fa-tags fa-2x" ></i><material-button inline-block ng-repeat="tag in entity.tags">#{{tag.title}}</material-button></div>'
        };
    })
    .directive('tagSugestion',function(){
        return {
            restrict : 'EA',
            templateUrl : ''
        }
    })