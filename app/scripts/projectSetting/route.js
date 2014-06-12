angular.module('cri.projectSetting')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('projectSettings',{
                url : '/project/:pid/settings',
                views :{
                    mainView : {
                        templateUrl:'/scripts/projectSetting/templates/projectSettings.tpl.html',
                        controller: 'ProjectSettingCtrl'
                    }
                },
                resolve:{
                    project:['$stateParams','Project',function($stateParams,Project){
                        return Project.fetch({accessUrl:$stateParams.pid})
                    }]
                }
            })
            .state('projectSettings.basic',{
                url : '/basic',
                views :{
                    settingView : {
                        templateUrl:'/scripts/projectSetting/templates/basic.tpl.html',
                        controller: 'ProjectBasicCtrl'
                    }
                }
            })
            .state('projectSettings.media',{
                url : '/media',
                views :{
                    settingView : {
                        templateUrl:'/scripts/projectSetting/templates/media.tpl.html',
                        controller: 'ProjectMediaCtrl'
                    }
                },
                resolve : {
                    files : function(Files, $stateParams){
                        return Files.fetch({projectUrl : $stateParams.pid});
                    }
                }
            })
            .state('projectSettings.apply',{
                url : '/apply',
                views :{
                    settingView : {
                        templateUrl:'/scripts/projectSetting/templates/apply.tpl.html',
                        controller: 'ProjectApplyCtrl'
                    }
                },
                resolve:{
                    applyteams:['Project',function(Project){
                        return Project.getApply({container:Project.data.id,$sort:{createDate:-1}});
//                        return jzCommon.query(apiServer+'/applyteams',{project:$route.current.params.pid,$sort:{createDate:-1}});
                    }]
                }
            })
            .state('projectSettings.team',{
                url : '/team',
                views :{
                    settingView : {
                        templateUrl:'/scripts/projectSetting/templates/team.tpl.html',
                        controller: 'ProjectTeamCtrl'
                    }
                }
            })
    }]);