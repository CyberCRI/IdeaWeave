angular.module('cri.common')
.factory('Socket',function(socketFactory,CONFIG){
//        var myIoSocket = io.connect(CONFIG.socketUrl);
//        return socketFactory({
//            ioSocket: myIoSocket
//        });
        return {
            on : function(){

            },
            emit : function(){

            }
        }
    })
.run(function(Socket){
//        Socket.on('connection',function(data){
//            console.log(data)
//        })
    })