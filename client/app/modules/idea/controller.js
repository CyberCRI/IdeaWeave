angular.module('cri.idea', ['ngSanitize'])
    .controller('IdeasCtrl', function ($scope, ideas) {
        $scope.ideas = ideas;
    })
    .controller('IdeaCreateCtrl', function ($scope, Idea, Notification, $state) {
        $scope.idea = {};
        $scope.title = "Create a New Idea";
 
        $scope.onDone = function () {
            Idea.create($scope.idea).then(function(data){
                $state.go('idea', { iid : data._id });
            }).catch(function(err){
                Notification.display(err.message);
            });
        }
    })
    .controller('IdeaCtrl', function ($scope, idea) {
        $scope.idea = idea;
        $scope.isOwner = ($scope.currentUser._id == idea.owner._id);
    })
    .controller('IdeaEditCtrl', function ($scope, Idea, idea, Notification, $state) {
        $scope.idea = idea;
        $scope.title = "Edit the Idea";

        $scope.onDone = function() {
            Idea.update(idea._id, $scope.idea).then(function(data){
                $state.go('idea', { iid : data._id });
            }).catch(function(err){
                Notification.display(err.message);
            });
        }
    });
