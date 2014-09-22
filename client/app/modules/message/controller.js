angular.module('cri.message',[])
.controller('MessageCtrl',['$scope',function($scope){

        $scope.showSendBtn = false;
        $scope.sendMessage = function(){
            $scope.$broadcast('sendMessage');
        };
    }])
    .controller('InboxCtrl',['$scope','messages','Message','$state',function($scope,messages,Message,$state){
        $scope.$parent.showSendBtn = false;
        $scope.messages = messages;
        $scope.reply = function(to){
            Message.to = to;
            $state.go('message.send');
        };
    }])
.controller('SendMessagesCtrl',['$scope','Message','Notification','Config',function($scope,Message,Notification,Config){



        $scope.$parent.showSendBtn = true;
        $scope.$on('sendMessage',function(){
            if($scope.message.message && $scope.message.user){
                $scope.message.to = $scope.message.user.id;
                delete $scope.message.user;
                Message.send($scope.message).then(function(){
                    Notification.display('message send !');
                }).catch(function(err){
                    Notification.display('message not send !');

                });
            }else{
                Notification.display('uncomplete message');
            }

        });
        var first = true;
        $scope.refreshReceiver = function(param){
            Message.refreshUsersList(param).then(function(data){
                $scope.searchResult = data;
                if(Message.to && first){
                    angular.forEach(data,function(message){
                        if(message.id == Message.to){
                            $scope.message = {
                                user : message
                            };
                            Message.to = null;
                        }
                    });
                }
            }).catch(function(err){
                console.log(err);
            });
        };

        $scope.tinymceOptions = Config.tinymceOptions;
    }]);