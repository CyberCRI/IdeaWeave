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
    .controller('IdeaCtrl', function ($scope, $state, Idea, Notification, challenges, projects, idea) {
        $scope.idea = idea;
        $scope.isOwner = ($scope.currentUser && $scope.currentUser._id == idea.owner._id);

        $scope.challenges = challenges;
        $scope.projects = projects;

        $scope.newLink = {
            project: null,
            challenge: null
        };

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
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

        $scope.addLinkToProject = function() {
            // TODO: enable/disable button during operation
            Idea.addLinkToProject(idea._id, $scope.newLink.project._id).then(function(newIdea) {
                Notification.display("Added link to project");

                // Refresh idea
                $scope.idea = newIdea;

                // Clear select box
                $scope.newLink.project = null;
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

        $scope.removeLinkToProject = function(projectId) {
            // TODO: enable/disable button during operation
            Idea.removeLinkToProject(idea._id, projectId).then(function(newIdea) {
                Notification.display("Removed link to project");

                // Refresh idea
                $scope.idea = newIdea;
            }).catch(function(err){
                Notification.display(err.message);
            });
        }; 

        
        $scope.addLinkToChallenge = function() {
            // TODO: enable/disable button during operation
            Idea.addLinkToChallenge(idea._id, $scope.newLink.challenge._id).then(function(newIdea) {
                Notification.display("Added link to challenge");

                // Refresh idea
                $scope.idea = newIdea;

                // Clear select box
                $scope.newLink.challenge = null;
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

        $scope.removeLinkToChallenge = function(challengeId) {
            // TODO: enable/disable button during operation
            Idea.removeLinkToChallenge(idea._id, challengeId).then(function(newIdea) {
                Notification.display("Removed link to challenge");

                // Refresh idea
                $scope.idea = newIdea;
            }).catch(function(err){
                Notification.display(err.message);
            });
        }; 

        $scope.removeIdea = function() {
            Idea.remove(idea._id).then(function() {
                Notification.display("Removed idea");

                $state.go("home");
            }).catch(function(err){
                Notification.display(err.message);
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
