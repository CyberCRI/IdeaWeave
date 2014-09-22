angular.module('cri.admin.profile')
.config(function($stateProvider){
    $stateProvider
        .state('profileAdmin',{
            url : '/admin/profile/:uid',
            views : {
                mainView : {
                    templateUrl: 'modules/admin/profile/templates/edit.tpl.html',
                    controller: 'AdminProfileCtrl'
                }
            }
        });
    });