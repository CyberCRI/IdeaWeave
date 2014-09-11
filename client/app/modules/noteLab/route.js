angular.module('cri.noteLab')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('project.noteLab',{
                url : '/workspace',
                views : {
                    projectView: {
                        templateUrl:'modules/noteLab/templates/notes.tpl.html',
                        controller: 'NoteLabCtrl'
                    }
                },
                resolve:{
                    notes:['NoteLab','$stateParams',function(NoteLab,$stateParams){
                        return NoteLab.fetch({projectUrl: $stateParams.pid})
                    }]
                }
            })
            .state('project.noteLab.details',{
                url : '/:tid',
                views : {
                    topicView: {
                        templateUrl:'modules/noteLab/templates/notedetails.tpl.html',
                        controller: 'NoteLabDetailsCtrl'
                    }
                }
            })
            .state('project.noteLab.details.discussion',{
                url : '/discussion',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/noteLab/templates/discussion.tpl.html'
                    }
                }
            })
            .state('project.noteLab.details.resources',{
                url : '/resources',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/noteLab/templates/resources.tpl.html'
                    }
                }
            })
    }]);