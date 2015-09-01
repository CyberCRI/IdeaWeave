angular.module('cri.common')
.factory('Notification', function($window, $mdToast){
        var service = {
            display : function(message) {
                $mdToast.show({
                    controller: function($scope) {
                        $scope.message = message;
                        $scope.closeToast = function() {
                            $mdToast.hide();
                        };
                    },
                    templateUrl: 'modules/notification/templates/toast.tpl.html',
                    duration: 5000,
                    position: 'top left'
                });
            },
            displaySocketNotification : function(notification) {
                $mdToast.show({
                    controller: function($scope) {
                        $scope.notification = notification;

                        $scope.closeToast = function() {
                            $mdToast.hide();
                        };
                    },
                    templateUrl: 'modules/notification/templates/socketToast.tpl.html',
                    duration: 5000,
                    position: 'top right'
                });
            }
        };
        return service;
    });