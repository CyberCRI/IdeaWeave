angular.module('cri.project')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('projectSettings',{
                url : '/admin/project/:pid',
                views :{
                    mainView : {
                        templateUrl:'modules/project/admin/templates/projectSettings.tpl.html',
                        controller: 'ProjectSettingCtrl'
                    }
                },
                resolve:{
                    project:['$stateParams','Project',function($stateParams,Project){
                        return Project.fetch({_id:$stateParams.pid})
                    }]
                }
            })

    }]);