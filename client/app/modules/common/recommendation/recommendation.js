angular.module('cri.common')
.factory('Recommendation',['$q','$http','Config',function($q,$http,Config){
        var service = {
            fetchUsers : function(id,tags,type){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/recommendations/user/'+id,{
                    params : {
                        tags : tags,
                        type : type
                    }
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            fetchProjects : function(id,tags,type){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/recommendations/project/'+id,{
                    params : {
                        tags : tags,
                        type : type
                    }
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            },
            fetchChallenges : function(id,tags,type){
                var defered = $q.defer();
                $http.get(Config.apiServer+'/recommendations/challenge/'+id,{
                    params : {
                        tags : tags,
                        type : type
                    }
                }).success(function(data){
                    defered.resolve(data);
                }).error(function(err){
                    defered.reject(err);
                });
                return defered.promise;
            }
        };
        return service;
    }]);