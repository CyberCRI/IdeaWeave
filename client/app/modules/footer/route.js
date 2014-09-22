angular.module('cri.footer')
    .config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('about',{
                url : '/about',
                views : {
                    mainView : {
                        templateUrl: 'modules/footer/templates/about.tpl.html'
                    }
                }
            })
            .state('contact',{
                url : '/contact',
                views : {
                    mainView : {
                        templateUrl: 'modules/footer/templates/contact.tpl.html'
                    }
                }
            })
            .state('faq',{
                url : '/faq',
                views : {
                    mainView : {
                        templateUrl: 'modules/footer/templates/faq.tpl.html'
                    }
                }
            })
            .state('join',{
                url : '/join',
                views : {
                    mainView : {
                        templateUrl: 'modules/footer/templates/join.tpl.html'
                    }
                }
            })
            .state('term',{
                url : '/join',
                views : {
                    mainView : {
                        templateUrl: 'modules/footer/templates/term.tpl.html'
                    }
                }
            })
            .state('termContent',{
                url : '/term-content',
                views : {
                    mainView : {
                        templateUrl: 'modules/footer/templates/term_content.tpl.html'
                    }
                }
            });
    }]);
