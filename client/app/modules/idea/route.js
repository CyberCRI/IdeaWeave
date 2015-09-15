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
                    idea: function ($stateParams, $state, Notification, Idea) {
                        return Idea.fetch($stateParams.iid)
                        .catch(function(error) {
                            Notification.display('Cannot find the requested idea');
                            $state.go("home");
                            return;
                        });
                    },
                    challenges: function(Challenge) { return Challenge.fetch() },
                    projects: function(Project) { return Project.fetch(); }
                },
                views :{
                  mainView :{
                      templateUrl: 'modules/idea/templates/idea.tpl.html',
                      controller : 'IdeaCtrl'
                  }
                }
            })
            .state('editIdea',{
                url : '/editIdea/:iid',
                resolve: {
                    idea: function ($stateParams, Idea) {
                        return Idea.fetch($stateParams.iid);
                    }
                },
                views :{
                  mainView :{
                      templateUrl: 'modules/idea/templates/idea-create.tpl.html',
                      controller : 'IdeaEditCtrl'
                  }
                }
            });
    }]);
