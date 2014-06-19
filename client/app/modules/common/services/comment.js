angular.module('cri.common')
.factory('Comment',['$q','$http','CONFIG',function($q,$http,CONFIG){
        var URI = '/comments',
            service = {
                post : function(comment){
                    var defered = $q.defer();
                    $http.post(CONFIG.apiServer+URI,comment).success(function(data){
                        defered.resolve(data);
                    }).error(function(err){
                        defered.reject(err);
                    })
                    return defered.promise;
                },
                fetch : function(param){
                    var defered = $q.defer();
                    var url = CONFIG.apiServer + URI;
                    if (param){
                        url = url + '?' + JSON.stringify(param);
                    }
                    $http.get(url).success(function(data){
                        defered.resolve(data)
                    }).error(function(err){
                        defered.reject(err);
                    })
                    return defered.promise;
                },
                delete : function(commentId){
                    var defered = $q.defer();
                    var url = CONFIG.apiServer + URI + '/'+commentId;
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