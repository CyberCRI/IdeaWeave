angular.module('cri.admin')
    .config(['$translateProvider',function ($translateProvider){
        $translateProvider.translations('en', {
            'CREATE_CHALLENGE': 'Create challenge',
            'LIST_CHALLENGES': 'List challenges',
        });

        $translateProvider.translations('zh_CN', {
            'CREATE_CHALLENGE': 'Create a Challenge',
            'LIST_CHALLENGES': 'Challenge list'
        });
    }]);