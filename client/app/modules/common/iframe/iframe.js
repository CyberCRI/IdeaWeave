angular.module('cri.common')
.directive('trello',[function(){
        return {
            restrict : 'EA',
            templateUrl : 'modules/common/iframe/trelloEmbed.tpl.html',
            scope : {
                id:'@',
                height : '@'
            },
            link:function(scope,element,attrs){
                scope.iframeUrl = 'https://trello.com/b/'+scope.id+'.html';
                scope.linkUrl = 'https://trello.com/b/'+scope.id;
            }
        };
    }]);