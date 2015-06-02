angular.module('cri.idea', ['ngSanitize'])
    .controller('IdeasCtrl', function ($scope, ideas) {
        $scope.ideas = ideas;
    })
    .controller('IdeaCreateCtrl', function ($scope, Idea, Notification, $state) {
        $scope.idea = {};

        $scope.createIdea = function() {
            Idea.create($scope.idea).then(function(data){
                $state.go('idea', { iid : data._id });
            }).catch(function(err){
                Notification.display(err.message);
            });
        }
    })
    .controller('IdeaCtrl', function($scope) {
    });
