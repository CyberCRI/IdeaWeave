angular.module('cri.common')
    .directive('scroller', [function () {
        return {
            restrict: 'A',
            // new
            scope: {
                loadingMethod: "&"
            },
            link: function (scope, elem, attrs) {
                var rawElement = elem[0];
                elem.bind('scroll', function () {
                    console.log(rawElement.scrollTop,rawElement.scrollHeight)
                    if((rawElement.scrollTop + rawElement.offsetHeight+5) >= rawElement.scrollHeight){
                        scope.$apply(scope.loadingMethod); //new
                    }
                });
            }
        };
    }]);