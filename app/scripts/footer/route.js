angular.module('cri.footer')
    .config(function($stateProvider){
        $stateProvider
            .state('about',{
                url : '/about',
                views : {
                    mainView : {
                        templateUrl: '/scripts/footer/templates/about.tpl.html'
                    }
                }
            })
            .state('contact',{
                url : '/contact',
                views : {
                    mainView : {
                        templateUrl: '/scripts/footer/templates/contact.tpl.html'
                    }
                }
            })
            .state('faq',{
                url : '/faq',
                views : {
                    mainView : {
                        templateUrl: '/scripts/footer/templates/faq.tpl.html'
                    }
                }
            })
            .state('join',{
                url : '/join',
                views : {
                    mainView : {
                        templateUrl: '/scripts/footer/templates/join.tpl.html'
                    }
                }
            })
            .state('term',{
                url : '/join',
                views : {
                    mainView : {
                        templateUrl: '/scripts/footer/templates/term.tpl.html'
                    }
                }
            })
            .state('termContent',{
                url : '/term-content',
                views : {
                    mainView : {
                        templateUrl: '/scripts/footer/templates/term_content.tpl.html'
                    }
                }
            })
    })
