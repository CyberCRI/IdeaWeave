angular.module('cri.common')
.factory('Recommend',function($q,$http,CONFIG){
        var service = {
            fetchUser : function(userId){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/recommends/stag/'+userId)
                    .success(function(data){
                        defered.resolve(data);
                    })
                    .error(function(err){
                        defered.reject(err);
                    })
                return defered.promise;
            },
            fetchFriendsUser : function(userId){
                var defered = $q.defer();
                $http.get(CONFIG.apiServer+'/recommends/ffollow/'+userId)
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
                $http.get(CONFIG.apiServer+'/recommends/stagp/'+userId)
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
                $http.get(CONFIG.apiServer+'/recommends/stagc/'+userId)
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
    })