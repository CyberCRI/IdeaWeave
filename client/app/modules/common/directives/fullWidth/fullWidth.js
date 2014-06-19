angular.module('cri.common')
.directive('fullWidth',function(){
        return {
            link : function(scope,element,attrs){
            console.log(element[0].getElementsByTagName('iframe').width)

            element[0].getElementsByTagName('iframe').width = '100%';
//                element.find('iframe').attr('width','100%');
            }
        }
    })