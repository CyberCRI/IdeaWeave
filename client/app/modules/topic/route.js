angular.module('cri.topic')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider

            .state('project.topic',{
                url : '/forum',
                views : {
                    projectView: {
                        templateUrl:'modules/topic/templates/topic.tpl.html',
                        controller: 'ProjectTopicCtrl'
                    }
                },
                resolve:{
                    project:['Project','$stateParams',function(Project,$stateParams){
                        return Project.fetch({accessUrl: $stateParams.pid,context:'detail'})
                    }]
                }
            })
            .state('project.topic.details',{
                url : '/:tid',
                abstract : true,
                views : {
                    topicView: {
                        templateUrl:'modules/topic/templates/topic-details.tpl.html',
                        controller: 'ProjectTopicDetailsCtrl'
                    }
                }
            })
            .state('project.topic.details.discussion',{
                url : '/discussion',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/topic/templates/discussion.tpl.html'
                    }
                }
            })
            .state('project.topic.details.resources',{
                url : '/resources',
                views : {
                    topicDetailsView: {
                        templateUrl:'modules/topic/templates/resources.tpl.html'
                    }
                }
            })
    }]);