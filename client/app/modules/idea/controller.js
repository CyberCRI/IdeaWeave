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
    .controller('IdeaCtrl', function ($scope, Idea, Notification, idea) {
        $scope.idea = idea;
        $scope.isOwner = ($scope.currentUser && $scope.currentUser._id == idea.owner._id);

        $scope.isFollowing = function() {
            if(!$scope.currentUser) return false;
            return !!_.findWhere(idea.followers, { _id: $scope.currentUser._id });
        }

        $scope.follow = function () {
            var promise = $scope.isFollowing() ? Idea.unfollow(idea._id) : Idea.follow(idea._id);
            promise.then(function(data) {
                idea.followers = data.followers;
                if($scope.isFollowing()) {
                    Notification.display('You are now following this idea');
                } else {
                    Notification.display('You are not following this idea anymore');
                }
            });
        };
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
