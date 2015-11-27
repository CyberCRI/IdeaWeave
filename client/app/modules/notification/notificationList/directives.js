angular.module('cri.common')
.directive('notification', function() {
    return {
        restrict: 'E',
        scope: {
            notification: '=',
            highlight: '=',
            brief: '=?' // If true, shows less info
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
            function updateHighlighting() {
                _.each($scope.notifications, function(notification) {
                    notification.highlight = (Date.parse(notification.createDate) > Date.parse($scope.highlightAfterDate));
                });
            }

            $scope.$watch("highlightAfterDate", updateHighlighting);
        }
    };
});