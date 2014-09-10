angular.module('cri.files')
    .directive('gDocPreview', [function () {
        return {
            restrict: 'EA',
            replace : true,
            template: '<iframe style="width:100%; height:500px;" frameborder="0"></iframe>',
            scope: {
                docUrl : '='
            },
            link: function (scope, element, attrs) {
                var url = "http://docs.google.com/gview?url=" + scope.docUrl + "&embedded=true";
                element.attr('src',url);
            }
        }
    }])