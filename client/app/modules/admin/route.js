angular.module('cri.admin')
.config(['$stateProvider',function($stateProvider){
        $stateProvider
            .state('admin',{
                url : '/admin',
                views : {
                    mainView : {
                        templateUrl : 'modules/admin/templates/admin.tpl.html',
                        controller : 'adminCtrl'
                    }
                },
                resolve : {
                    usersList : ['users',function(users){
                        return users.fetch();
                    }],
                    tags : ['Tag',function(Tag){
                        return Tag.fetch();
                    }]

                }
            })

    }]);