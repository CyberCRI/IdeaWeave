angular.module('cri.config',[])
.constant('CONFIG',{
        apiServer : "http://" + window.location.hostname + ":5011",
        socketUrl : "ideastorm.io",
        tinymceOptions : {
            resize: false,
            height: 300,
            plugins: 'print textcolor',
            toolbar: "undo redo styleselect bold italic print forecolor backcolor"
        },
        mapOptions : {
            scrollwheel : false,
            scaleControl : false,
            zoomControl : false,
            streetViewControl : false,
            disableDoubleClickZoom : false,
            panControl : false
        }
    })