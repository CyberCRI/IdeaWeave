angular.module('cri.idea', ['ngSanitize'])
    .controller('IdeasCtrl', function ($scope, ideas) {
        $scope.ideas = ideas;

        $scope.sortBy = "newest";
        $scope.sortOptions = ["newest", "most followed", "most liked"];

        $scope.$watch("sortBy", function() {
            var sortFunction = null;
            switch($scope.sortBy) {
                case "newest":
                    sortFunction = function(idea) {
                        return -1 * Date.parse(idea.createDate); 
                    };
                    break
                case "most followed":
                    sortFunction = function(idea) {
                        return -1 * idea.followers.length; 
                    };
                    break;
                case "most liked":
                    sortFunction = function(idea) {
                        return -1 * idea.likerIds.length; 
                    };
                    break;
            }

            if(sortFunction) {
                $scope.ideas = _.sortBy($scope.ideas, sortFunction);
            }
        });
    })
    .controller('IdeaCreateCtrl', function ($scope, Idea, Notification, $state) {
        $scope.idea = {
            title: "",
            brief: "",
            tags: []
        };
        $scope.title = "Create a New Idea";

        $scope.onDone = function () {
            Idea.create($scope.idea).then(function(data){
                $state.go('idea', { iid : data._id });
            }).catch(function(err){
                Notification.display(err.message);
            });
        }
    })
    .controller('IdeaCtrl', function ($scope, $state, $analytics, Idea, Notification, idea) {
        $scope.idea = idea;
        $scope.isOwner = ($scope.currentUser && $scope.currentUser._id == idea.owner._id);
        $scope.isLike = $scope.currentUser ? _.contains($scope.idea.likerIds,$scope.currentUser._id) : false;

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
                    $analytics.eventTrack("followIdea");
                } else {
                    Notification.display('You are not following this idea anymore');
                    $analytics.eventTrack("unfollowIdea");
                }
            }).catch(function(err){
                Notification.display(err.message);
            });
        };

        $scope.like=function(){
            if($scope.isLike){
                Idea.dislike($scope.idea._id).then(function(result){
                    Notification.display('You no longer like this idea');
                    $scope.idea.likerIds.splice($scope.idea.likerIds.indexOf($scope.currentUser._id),1);
                    $scope.isLike=false;
                    $analytics.eventTrack("dislikeIdea");
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }else{
                Idea.like($scope.idea._id).then(function(result){
                    Notification.display('You like this idea');
                    idea.likerIds.push($scope.currentUser._id);
                    $scope.isLike=true;
                    $analytics.eventTrack("likeIdea");
                }).catch(function(err){
                    Notification.display(err.message);
                });
            }
        };

        $scope.filterNewRelation = function(entity) {
            return !_.contains($scope.idea.projects, entity._id) && !_.contains($scope.idea.challenges, entity._id);
        };

        $scope.addNewRelation = function(entity) {
            switch(entity.type) {
                case "project":
                    return $scope.addLinkToProject(entity._id);
                case "challenge":
                    return $scope.addLinkToChallenge(entity._id);
            }
        }

        $scope.addLinkToProject = function(projectId) {
            // TODO: enable/disable button during operation
            Idea.addLinkToProject(idea._id, projectId).then(function(newIdea) {
                Notification.display("Added link to project");

                // Refresh idea
                $scope.idea = newIdea;
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

        
        $scope.addLinkToChallenge = function(challengeId) {
            // TODO: enable/disable button during operation
            Idea.addLinkToChallenge(idea._id, challengeId).then(function(newIdea) {
                Notification.display("Added link to challenge");

                // Refresh idea
                $scope.idea = newIdea;
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
