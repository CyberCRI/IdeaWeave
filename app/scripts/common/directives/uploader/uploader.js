angular.module('cri.common')
.directive('criUploader',function(){
        return {
            restrict : 'EA',

            templateUrl : "scripts/common/directives/uploader/uploader.tpl.html",
            link : function(scope,element,attrs){
                console.log(scope)
            }
        }
    })