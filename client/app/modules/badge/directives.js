angular.module('cri.badge')
.directive('badgeCard', function(){
    return {
        restrict:'E',
        scope : {
            badgeId : '=',
            myBadge : '='
        },
        templateUrl:'modules/badge/templates/badge-card.tpl.html',
        controller : function($scope, Badge){
            if($scope.badgeId){
                Badge.getBadge($scope.badgeId).then(function(badge){
                    $scope.badge = badge;
                }).catch(function(err){
                    console.log('error',err);
                });
            } else {
                $scope.badge = $scope.myBadge;
            }
        }
    };
});
