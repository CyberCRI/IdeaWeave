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
})
.directive('creditCard', function(){
    return {
        restrict:'E',
        scope : {
            creditId : '=',
            myCredit : '=',
            showGivenBy: "=?",
            showGivenTo: "=?"
        },
        templateUrl:'modules/badge/templates/credit-card.tpl.html',
        controller : function($scope, Badge){
            _.defaults($scope, {
                showGivenBy: true,
                showGivenTo: true
            });

            if($scope.creditId){
                Badge.getCredit($scope.creditId).then(function(credit){
                    $scope.credit = credit;
                }).catch(function(err){
                    console.log('error',err);
                });
            } else {
                $scope.credit = $scope.myCredit;
            }
        }
    };
});
