angular.module('cri.common')
.directive('pdfJs',function(){
        return {
            restrict : 'E',
            scope : {
                url : '=',
                height : '@',
                width : '@'
            },
            template : '<canvas id="the-canvas" style="border:1px  solid black">' +
                'Your browser is too old to display pdf files' +
                '</canvas>',
            link : function(scope,element,attrs){
                PDFJS.disableWorker = true;
                PDFJS.getDocument(scope.url).then(function(pdf){
                    pdf.getPage(1).then(function getPageHelloWorld(page) {
                        var scale = 1;
                        var viewport = page.getViewport(scale);

                        var canvas = element.find('canvas')[0];
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        //
                        // Render PDF page into canvas context
                        //
                        page.render({canvasContext: context, viewport: viewport});
                    })
                })

            }
        }
    })