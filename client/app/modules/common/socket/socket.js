angular.module('cri.common')
    .factory('mySocket',['socketFactory','Notification','$rootScope','Config', function (socketFactory,Notification,$rootScope,Config) {

        var service = {
            init : function(me){
                var myIoSocket = io.connect(Config.apiServer);

                service.socket = socketFactory({
                    ioSocket: myIoSocket
                });
                service.socket.on('connect',function(){
                    service.socket.emit('init', me._id);
                    service.socket.on("notification", Notification.displaySocketNotification);
                });

            }
        };
        return service;
    }]);