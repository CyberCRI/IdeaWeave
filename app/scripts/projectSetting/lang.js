angular.module('cri.projectSetting')
    .config(['$translateProvider',function ($translateProvider){
        $translateProvider.translations('en', {
            'PROJECT_TITLE': 'Jizhi Project'

            //
        });

        $translateProvider.translations('zh_CN', {
            'PROJECT_TITLE': '积致项目'

            //
        });



    }]);