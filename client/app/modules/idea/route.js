angular.module('cri.idea')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('ideas',{
                url : '/ideas/:tag',
                views : {
                    mainView : {
                        templateUrl: 'modules/idea/templates/ideas.tpl.html',
                        controller : 'IdeasCtrl'
                    }
                },
                resolve : {
                    ideas: function (Idea, $stateParams, Config) {
                        return Idea.getByTag($stateParams.tag, { limit : Config.paginateIdea, skip : 0 });
                    }
                }
            })
            .state('createIdea',{
                url : '/createIdea',
                views :{
                    mainView :{
                        templateUrl: 'modules/idea/templates/idea-create.tpl.html',
                        controller: 'IdeaCreateCtrl'
                    }
                }
            })
            .state('idea',{
                url : '/idea/:iid',
                resolve: {
                    idea: function ($stateParams, Idea) {
                        var option = {
                            accessUrl : $stateParams.iid
                        };

                        return Idea.fetch(option);
                    }
                },
                views :{
                  mainView :{
                      templateUrl: 'modules/idea/templates/idea.tpl.html',
                      controller : 'NewChallengeCtrl'
                  }
                }
            });
    }]);
