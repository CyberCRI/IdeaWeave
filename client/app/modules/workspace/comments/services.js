angular.module('cri.workspace')
.factory('Comment',['$q','$http','Config','mySocket',function($q,$http,Config,mySocket){
        var URI = '/comments',
            service = {
                post : function(comment){
                    var defered = $q.defer();
                    $http.post(Config.apiServer+'/note/'+comment.container+'/comments',comment).success(function(comment){
                        defered.resolve(comment);
                    }).error(function(err){
                        defered.reject(err);
                    });
                    return defered.promise;
                },
                fetch : function(param){
                    var defered = $q.defer();
                    var url = Config.apiServer + '/note/'+param.container+'/comments';

                    $http.get(url,{
                        params : param
                    }).success(function(data){
                        defered.resolve(data)
                    }).error(function(err){
                        defered.reject(err);
                    })
                    return defered.promise;
                },
                delete : function(commentId){
                    var defered = $q.defer();
                    var url = Config.apiServer + URI + '/'+commentId;
                    $http.delete(url).success(function(data){
                        defered.resolve(data)
                    }).error(function(err){
                        defered.reject(err);
                    })
                    return defered.promise;
                }
        }
        return service;
    }])