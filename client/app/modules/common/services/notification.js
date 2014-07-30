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
                    templateUrl: 'modules/common/modal/toast.tpl.html',
                    duration: 5000,
                    position: 'top fit'
                });
            }
        };
        return service;
    }])