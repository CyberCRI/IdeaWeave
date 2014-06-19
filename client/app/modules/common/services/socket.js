angular.module('cri.common')
.factory('Socket',['socketFactory','CONFIG',function(socketFactory,CONFIG){
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
    }])