angular.module('cri.tag')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('tag', {
                url : '/tag/:name',
                views : {
                    mainView : {
                        templateUrl: 'scripts/tag/templates/tag.tpl.html',
                        controller: 'TagCtrl'
                    }
                },
                resolve : {
                    tagDatas : function(Tag,$stateParams){
                        return Tag.fetch($stateParams.name)
                    }
                }
            })
    }]);
