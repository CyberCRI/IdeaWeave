angular.module('cri.tag')
    .config(['$translateProvider',function ($translateProvider){
        $translateProvider.translations('en', {
            'TAG_TITLE': 'Jizhi Search',
            'TAG_USER':'User:',
            'TAG_CHALLENGE':'Challenge:',
            'TAG_PROJECT':'Project:',
            'TAG_NOT_MATCH':'No result match.',
        });

        $translateProvider.translations('zh_CN', {
            'TAG_TITLE': '积致搜索',
            'TAG_USER':'用户：',
            'TAG_CHALLENGE':'挑战：',
            'TAG_PROJECT':'创意:',
            'TAG_NOT_MATCH':'No result match.',
        });


    }]);