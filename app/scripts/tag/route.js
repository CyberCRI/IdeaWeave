angular.module('cri.tag')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('tag', {
                url : '/tag/:title',
                views : {
                    mainView : {
                        templateUrl: 'scripts/tag/templates/tag.tpl.html',
                        controller: 'TagCtrl'
                    }
                }
            })
    }]);
