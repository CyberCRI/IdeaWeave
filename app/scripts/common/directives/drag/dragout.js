angular.module('cri.common')
.directive('dragOut',function(){
    return {
        template : '<a class="dragme" draggable="true" data-downloadurl="{{ dropDownloadUrl }}" ng-transclude>{{ file.originalName }}</a>',
        restrict : 'E',
        transclude : true,
        scope : {
            file : "=",
            url : "="
        },
        link : function(scope, el, attrs){
            scope.dropDownloadUrl = scope.file.mimeType+':'+scope.file.filename+':'+scope.url+scope.file.filename;
            el.find('a').attr('href' , scope.url+'/'+scope.file.filename);
            el[0].addEventListener('dragstart',function(e){
                e.dataTransfer.setData("DownloadURL",el.attr( scope.dropDownloadUrl));
            },false)
        }
    }
})
