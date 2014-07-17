angular.module('cri.projectSetting')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('project.settings',{
                url : '/settings',
                views :{
                    projectView : {
                        templateUrl:'modules/projectSetting/templates/projectSettings.tpl.html',
                        controller: 'ProjectSettingCtrl'
                    }
                },
                resolve:{
                    project:['$stateParams','Project',function($stateParams,Project){
                        return Project.fetch({accessUrl:$stateParams.pid})
                    }]
                }
            })
            .state('project.settings.poster',{
                url : '/poster',
                views :{
                    settingView : {
                        templateUrl:'modules/projectSetting/templates/poster.tpl.html',
                        controller: 'ProjectPosterCtrl'
                    }
                }
            })
            .state('project.settings.basic',{
                url : '/basic',
                views :{
                    settingView : {
                        templateUrl:'modules/projectSetting/templates/basic.tpl.html',
                        controller: 'ProjectBasicCtrl'
                    }
                }
            })
            .state('project.settings.media',{
                url : '/media',
                views :{
                    settingView : {
                        templateUrl:'modules/projectSetting/templates/media.tpl.html',
                        controller: 'ProjectMediaCtrl'
                    }
                },
                resolve : {
                    files : ['Files', '$stateParams',function(Files, $stateParams){
                        return Files.fetch({projectUrl : $stateParams.pid});
                    }],
                    urls : ['Url','$stateParams',function(Url,$stateParams){
                        return Url.fetch({ project : $stateParams.pid });
                    }]
                }
            })
            .state('project.settings.apply',{
                url : '/apply',
                views :{
                    settingView : {
                        templateUrl:'modules/projectSetting/templates/apply.tpl.html',
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
            .state('project.settings.trello',{
                url : '/trello',
                views : {
                    settingView : {
                        templateUrl : 'modules/projectSetting/templates/trello.tpl.html'
                    }
                }
            })
            .state('project.settings.team',{
                url : '/team',
                views :{
                    settingView : {
                        templateUrl:'modules/projectSetting/templates/team.tpl.html',
                        controller: 'ProjectTeamCtrl'
                    }
                }
            })
    }]);