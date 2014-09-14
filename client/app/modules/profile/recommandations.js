angular.module('cri.profile')
.factory('Recommandations',['$q','$http','Config',function($q,$http,Config){
        var service = {
            fetchUser : function(userId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/recommandations/user/'+userId)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            fetchProject : function(userId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/recommandations/project/'+userId)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            fetchChallenge : function(userId){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/recommandations/challenge/'+userId)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            }
        }
        return service;
    }])