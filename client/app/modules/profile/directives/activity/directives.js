angular.module('cri.user')
.directive('activityTopic',['$http','Config',function($http,Config){
        return {
            restrict : 'EA',
            templateUrl :'modules/profile/directives/activity/topic-activity.tpl.html',
            exclude:true,
            scope : {
                activity : '='
            },
            link :function(scope,element,attrs){
                $http.get(Config.apiServer+'/pforums/'+scope.activity.entity.id).success(function(topic){
                    scope.topic = topic;
                    $http.get(Config.apiServer+'/projects/'+topic.container).success(function(project){
                        scope.project = project ;
                    }).catch(function(err){
                        console.log(err);
                    })
                }).catch(function(err){
                    console.log(err);
                })
            }
        }
    }])
    .directive('activityComment',['$http','Config',function($http,Config){
        return {
            restrict : 'EA',
            templateUrl :'modules/profile/directives/activity/comment-activity.tpl.html',
            exclude:true,
            scope : {
                activity : '='
            },
            link :function(scope,element,attrs){
                $http.get(Config.apiServer+'/pforums/'+scope.activity.container).success(function(topic){
                    scope.topic = topic ;
                    $http.get(Config.apiServer+'/projects/'+topic.container).success(function(project){
                        scope.project = project;
                    })
                }).catch(function(err){
                    console.log(err);
                })
            }
        }
    }])
    .directive('activityFollow',['$http','Config',function($http,Config){
        return {
            restrict : 'EA',
            templateUrl :'modules/profile/directives/activity/follow-activity.tpl.html',
            exclude:true,
            scope : {
                activity : '=',
                follow : '@',
                type : '@'
            },
            link :function(scope,element,attrs){
                if(scope.follow){
                    scope.message = 'follow';
                }else{
                    scope.message = 'unfollow';
                }
                switch(scope.type){
                    case 'projects':
                        $http.get(Config.apiServer+'/projects/'+scope.activity.entity).success(function(project){
                            scope.entity = project ;
                        }).catch(function(err){
                            console.log(err);
                        });
                        break;
                    case 'users':
                        $http.get(Config.apiServer+'/users/'+scope.activity.entity).success(function(user){
                            scope.entity = user;
                        }).catch(function(err){
                            console.log(err);
                        });
                        break;
                    case 'challenges':
                        $http.get(Config.apiServer+'/challenges/'+scope.activity.entity).success(function(challenges){
                            scope.entity = challenges ;
                        }).catch(function(err){
                            console.log(err);
                        });
                        break;
                    default :
                        scope.message = 'something went wrong'
                        break;
                }
            }
        }
    }])
