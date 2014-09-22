angular.module('cri.common')
    .directive('scroller', [function () {
        return {
            restrict: 'A',
            scope: {
                loadingMethod: "&"
            },
            link: function (scope, elem, attrs) {
                var rawElement = elem[0];
                elem.bind('scroll', function () {
                    if((rawElement.scrollTop + rawElement.offsetHeight+5) >= rawElement.scrollHeight){
                        scope.$apply(scope.loadingMethod); //new
                    }
                });
            }
        };
    }]);