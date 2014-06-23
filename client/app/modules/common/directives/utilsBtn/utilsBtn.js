angular.module('cri.common')
.directive('utilsBtn',[function(){
        return {
            restrict : 'EA',
            templateUrl : 'modules/common/directives/utilsBtn/utils-btn.tpl.html',
            scope : {
                clickMinus : "&"
            },link : function(scope,element,attr){
                scope.collapsed = false;
                var item = element.find('i');
                item.bind('click',function(){
                    scope.collapsed = !scope.collapsed;
                    console.log(scope.collapsed);
                    if(scope.collapsed){
                        item.removeClass('fa-minus');
                        item.addClass('fa-plus');
                    }else{
                        item.removeClass('fa-plus');
                        item.addClass('fa-minus');
                    }
                    return scope.clickMinus({ item : scope.collapsed});

                })
            }
        }
    }]);