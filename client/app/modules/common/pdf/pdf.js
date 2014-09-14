angular.module('cri.common')
.factory('Pdf',function($document,$window,NoteLab){
        var service = {
            fromHtml : function(){
                var doc = new $window.jsPDF();
                doc.fromHTML(document.getElementById('note'), 15, 15, {
                    'width': 170
                });
                doc.save(NoteLab.data.title);
            }
        };
        return service;
    });