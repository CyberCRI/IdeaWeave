angular.module('cri.admin.profile')
.config(function($stateProvider){
    $stateProvider
        .state('profileAdmin',{
            url : '/admin/myProfile',
            views : {
                mainView : {
                    templateUrl: 'modules/admin/profile/templates/edit.tpl.html',
                    controller: 'AdminProfileCtrl'
                }
            },
            resolve: { 
                followingTags: function(Profile) {
                    return Profile.listFollowingTags();
                }
            }
        });
    });