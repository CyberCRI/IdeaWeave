angular.module('cri.admin.project')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('projectAdmin',{
                url : '/admin/project/:pid',
                views :{
                    mainView : {
                        templateUrl:'modules/admin/project/templates/projectSettings.tpl.html',
                        controller: 'AdminProjectCtrl'
                    }
                },
                resolve:{
                    project:['$stateParams','Project',function($stateParams,Project){
                        return Project.fetch({_id:$stateParams.pid});
                    }]
                }
            });
    }]);