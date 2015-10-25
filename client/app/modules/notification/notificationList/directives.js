angular.module('cri.common')
.directive('notification', function() {
    return {
        restrict: 'E',
        scope: {
            notification: '=',
            highlight: '='
        },
        templateUrl:'modules/notification/notificationList/notification.tpl.html'
    };
}).directive('notificationList', function() {
    return {
        restrict: 'E',
        scope: {
            notifications: '=',
            highlightAfterDate: '='
        },
        templateUrl:'modules/notification/notificationList/notification-list.tpl.html',
        controller: function($scope) {
            _.each($scope.notifications, function(notification) {
                notification.highlight = (Date.parse(notification.createDate) > $scope.highlightAfterDate.value());
            });
        }
    };
});