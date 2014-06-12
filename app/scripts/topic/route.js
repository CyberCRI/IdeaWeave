angular.module('cri.topic')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider

            .state('topic',{
                url : '/project/:pid/topic',
                views : {
                    mainView: {
                        templateUrl:'/scripts/topic/templates/topic.tpl.html',
                        controller: 'ProjectTopicCtrl'
                    }
                },
                resolve:{
                    project:['Project','$stateParams',function(Project,$stateParams){
                        return Project.fetch({accessUrl: $stateParams.pid,context:'detail'})
                    }]
                }
            })
            .state('topic.details',{
                url : '/:tid',
                views : {
                    topicView: {
                        templateUrl:'/scripts/topic/templates/topic-details.tpl.html',
                        controller: 'ProjectTopicDetailsCtrl'
                    }
                }
            })
    }]);