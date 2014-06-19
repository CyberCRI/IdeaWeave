angular.module('cri.common')
.directive('criUploader',function(){
        return {
            restrict : 'EA',
            templateUrl : "modules/common/directives/uploader/uploader.tpl.html",
            link : function(scope,element,attrs){
                console.log(scope)
            }
        }
    })