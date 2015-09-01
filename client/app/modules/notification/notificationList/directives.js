angular.module('cri.common')
.directive('notification', function() {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl:'modules/notification/notificationList/notification.tpl.html',
        line: function(scope, element, attrs) {
            scope.notification = attrs.notification;
        }
    };
}).directive('notificationList', function() {
    return {
        restrict: 'E',
        scope: {
            notifications: '='
        },
        templateUrl:'modules/notification/notificationList/notification-list.tpl.html',
        line: function(scope, element, attrs) {
            scope.notifications = attrs.notifications;
        }
    };
});