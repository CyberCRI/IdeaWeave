angular.module('cri.message',[])
.controller('MessageCtrl',['$scope',function($scope){

        $scope.showSendBtn = false
        $scope.sendMessage = function(){
            $scope.$broadcast('sendMessage');
        };
    }])
    .controller('InboxCtrl',['$scope','messages','Message','$state',function($scope,messages,Message,$state){
        $scope.$parent.showSendBtn = false
        $scope.messages = messages;
        $scope.reply = function(to){
            Message.to = to;
            $state.go('message.send');
        }
    }])
.controller('SendMessagesCtrl',['$scope','Message','toaster','CONFIG',function($scope,Message,toaster,CONFIG){



        $scope.$parent.showSendBtn = true;
        $scope.$on('sendMessage',function(){
            if($scope.message.message && $scope.message.to){
                $scope.message.to = $scope.message.user.id;
                delete $scope.message.user;
                Message.send($scope.message).then(function(){
                    toaster.pop('success','success','message send !');
                }).catch(function(err){
                    toaster.pop('error','error','message not send !');

                })
            }else{
                toaster.pop('info','warning','uncomplete message')
            }

        })
        var first = true;
        $scope.refreshReceiver = function(param){
            console.log(param)
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
                    })

                }
            }).catch(function(err){
                console.log(err);
            })
        }

        $scope.tinymceOptions = CONFIG.tinymceOptions;

    }])