angular.module('cri.common')
.directive('trello',[function(){
        return {
            restrict : 'EA',
            template :'<iframe width="100%" scrolling="true"></iframe>',
            scope : {
                id:'@',
                height : '@'
            },
            link:function(scope,element,attrs){
                element.find('iframe')
                    .attr('src','https://trello.com/b/'+scope.id+'.html')
                    .attr('height',scope.height);
            }
        };
    }]);