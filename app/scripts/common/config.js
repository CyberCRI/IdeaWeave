angular.module('cri.config',[])
.constant('CONFIG',{
        apiServer : "http://" + window.location.hostname + ":5011",
        socketUrl : "ideastorm.io"
    })