angular.module('cri.common')
.directive('notificationList', function() {
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