angular.module('cri.common')
.directive('activityTopic',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict : 'EA',
            templateUrl :'modules/common/directives/activity/topic-activity.tpl.html',
            exclude:true,
            scope : {
                activity : '='
            },
            link :function(scope,element,attrs){
                $http.get(CONFIG.apiServer+'/pforums/'+scope.activity.entity.id).success(function(topic){
                    scope.topic = topic;0
                    $http.get(CONFIG.apiServer+'/projects/'+topic.container).success(function(project){
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
    .directive('activityComment',['$http','CONFIG',function($http,CONFIG){
        return {
            restrict : 'EA',
            templateUrl :'modules/common/directives/activity/comment-activity.tpl.html',
            exclude:true,
            scope : {
                activity : '='
            },
            link :function(scope,element,attrs){
                $http.get(CONFIG.apiServer+'/pforums/'+scope.activity.container).success(function(topic){
                    scope.topic = topic ;
                    $http.get(CONFIG.apiServer+'/projects/'+topic.container).success(function(project){
                        scope.project = project;
                    })
                }).catch(function(err){
                    console.log(err);
                })
            }
        }
    }])
    .directive('activityFollow',['$http','CONFIG','loggedUser',function($http,CONFIG,loggedUser){
        return {
            restrict : 'EA',
            templateUrl :'modules/common/directives/activity/follow-activity.tpl.html',
            exclude:true,
            scope : {
                activity : '=',
                follow : '@',
                type : '@'
            },
            link :function(scope,element,attrs){
                console.log('ici :: : : :',scope.activity);
                if(scope.follow){
                    scope.message = 'follow';
                }else{
                    scope.message = 'unfollow';
                }
                switch(scope.type){
                    case 'projects':
                        $http.get(CONFIG.apiServer+'/projects/'+scope.activity.entity).success(function(project){
                            scope.entity = project ;
                        }).catch(function(err){
                            console.log(err);
                        });
                        break;
                    case 'users':
                        $http.get(CONFIG.apiServer+'/users/'+scope.activity.entity).success(function(user){
                            scope.entity = user;
                            if(loggedUser.profile.id == user.id){
                                scope.entity.realname = 'me';
                            }
                            console.log('user',scope.entity);
                        }).catch(function(err){
                            console.log(err);
                        });
                        break;
                    case 'challenges':
                        $http.get(CONFIG.apiServer+'/challenges/'+scope.activity.entity).success(function(challenges){
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