angular.module('cri.common')
.factory('Notification',['$window','$materialToast',function($window,$materialToast){
        var service = {
            authorize : function(){

            },
            display : function(message){
                $materialToast({
                    controller: ['$scope','$hideToast',function($scope, $hideToast) {
                        $scope.message = message;
                        $scope.closeToast = function() {
                            $hideToast();
                        };
                    }],
                    templateUrl: 'modules/notification/templates/toast.tpl.html',
                    duration: 5000,
                    position: 'top left'
                });
            },
            displaySocketNotification : function(notification){
                $materialToast({
                    controller: function($scope, $hideToast,$q,NoteLab) {
                        $scope.notification = notification;

                        $scope.closeToast = function() {
                            $hideToast();
                        };
                    },
                    templateUrl: 'modules/notification/templates/socketToast.tpl.html',
                    duration: 5000,
                    position: 'top right'
                });
            }
        };
        return service;
    }]);