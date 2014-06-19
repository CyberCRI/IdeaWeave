angular.module('cri.tag')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('tag', {
                url : '/tag/:title',
                views : {
                    mainView : {
                        templateUrl: 'modules/tag/templates/tag.tpl.html',
                        controller: 'TagCtrl'
                    }
                }
            })
    }]);
