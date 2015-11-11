angular.module('cri.profile')
.config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('profile', {
        url : '/profile/:uid',
        views : {
            mainView: {
                templateUrl: 'modules/profile/templates/profile.tpl.html',
                controller: 'ProfileCtrl'
            }
        },
        resolve : {
            activities : function(Profile,$stateParams,$state,Config,Notification){
                return Profile.getActivity($stateParams.uid,Config.activityLimit)
                .catch(function(error) {
                    Notification.display('Cannot find the requested user');
                    $state.go("home");
                    return;
                });
            },
            profile : function(Profile,$stateParams){
                return Profile.getProfile($stateParams.uid);
            }
        }
    })
    .state('feed',{
        url : '/feed',
        views : {
            mainView: {
                templateUrl: 'modules/profile/templates/feed.tpl.html',
                controller: 'FeedCtrl'
            }
        },
        resolve : {
            notifications: function(Profile) {
                return Profile.getFeed();
            }
        }
    });
}]);