angular.module('cri.common')
    .factory('mySocket',['socketFactory','Notification','$rootScope','Config', function (socketFactory,Notification,$rootScope,Config) {

        var service = {
            init : function(me){
                var myIoSocket = io.connect(Config.apiServer);

                service.socket = socketFactory({
                    ioSocket: myIoSocket
                });
                service.socket.on('connect',function(){
                    service.socket.emit('init',me._id);
                    service.socket.on('rooms::ready',function(){
                        service.socket.on('newProject',function(notif){
                            Notification.displaySocketNotif(notif);
                        });

                        service.socket.on('newChallenge',function(notif){
                            Notification.displaySocketNotif(notif);
                        });

                        service.socket.on('newMember',function(notif){
                            Notification.displaySocketNotif(notif);
                        });

                        service.socket.on('newNote',function(notif,note){
                            $rootScope.$broadcast('newNote',note);
                            Notification.displaySocketNotif(notif);
                        });

                        service.socket.on('newFile',function(notif){
                            Notification.displaySocketNotif(notif);
                        });

                        service.socket.on('newUrl',function(notif){
                            Notification.displaySocketNotif(notif);
                        });

                    });
                });

            }
        };
        return service;
    }]);